const fs = require("fs");
const { NFTStorage, File } = require('nft.storage');
const nftModel = require("../models/nft");

const mint = async (ctx, next) => {
  const { body, file } = ctx.req;
  ctx.request.body = { ...body };

  const schema = {
    token_id: { notEmpty: true, errorMessage: 'This field is required!'},
    name: { notEmpty: true, errorMessage: 'This field is required!'},
    description: { notEmpty: true, errorMessage: 'This field is required!'},
    category_id: { notEmpty: true, errorMessage: 'This field is required!'}
  };

  ctx.checkBody(schema);
  const errors = await ctx.validationErrors(true);
  if (errors) {
    ctx.body = errors;
    ctx.status = 400;
    return;
  }
  const data = {};
  Object.keys(schema).forEach((field) => {
    if (body[field] && body[field] !== undefined) data[field] = body[field];
  });
  if (file) {
    data.media = "/nft/" + file.filename;
    data.mine_type = file.mimetype;
  } else {
    ctx.body = { media: { params: "media", msg: "media is required!" } };
    ctx.status = 400;
    return;
  }
  const buffer = fs.readFileSync(file.path);
  const client = new NFTStorage({ token: process.env.TOKEN_URI })
  const metadata = await client.store({
    name: data.name,
    description: data.description,
    image: new File(
      [buffer],
      file.filename,
      { type: file.mimetype }
    ),
  })
  data.metadata = metadata ? metadata.url: ''
  const { address } = ctx.state.user;
  data.owner = address;
  const res = await nftModel.mintNft(data);
  if (!res.success) {
    ctx.body = res;
    ctx.status = 400;
    return next();
  }
  ctx.body = res.data;
  return next();
};

const updateNft = async (ctx, next) => {
  const { tokenId } = ctx.params;
  const { address } = ctx.state.user;
  const { body } = ctx.request;

  const schema = {
    name: {},
    description: {},
    collection_id: {},
    category_id: {}
  };

  ctx.checkBody(schema);
  const errors = await ctx.validationErrors(true);
  if (errors) {
    ctx.body = errors;
    ctx.status = 400;
    return;
  }
  const data = {};
  Object.keys(schema).forEach((field) => {
    if (body[field] && body[field] !== undefined) data[field] = body[field];
  });
  data.owner = address;
  const res = await nftModel.updateNft(tokenId, data);
  ctx.body = res;
  return next();
};

const detailNft = async (ctx) => {
  const { tokenId } = ctx.params;
  const nft = await nftModel.getByTokenId(tokenId);
  ctx.body = nft;
};

const listNft = async (ctx, next) => {
  const {
    category,
    name,
    owner,
    status,
    priceFrom,
    priceTo,
    page,
    limit,
    sort_by = "id",
    order_by = "desc",
  } = ctx.request.query;
  const conditions = [
    ['owner', owner],
    ['status', status],
    ['category_id', 'in', category ? category.split(",") : null],
    ['name', 'like', name ? `%${name}%` : null],
    ['price', '<=', priceTo],
    ['price', '>=', priceFrom],
  ];
  const orderBy = {
    field: sort_by,
    type: order_by,
  };
  const nft = await nftModel.getList(conditions, orderBy, limit, page);
  ctx.body = nft;
  return next();
};

module.exports = { mint, updateNft, detailNft, listNft };
