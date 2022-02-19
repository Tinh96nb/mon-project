const { makeThumbnail } = require("../helper");
const nftModel = require("../models/nft");
const historyModel = require("../models/nft_history");

const mint = async (ctx, next) => {
  const { body, file } = ctx.req;
  ctx.request.body = { ...body };

  const schema = {
    token_id: { notEmpty: true, errorMessage: 'This field is required!'},
    name: { notEmpty: true, errorMessage: 'This field is required!'},
    description: { notEmpty: true, errorMessage: 'This field is required!'},
    metadata: { notEmpty: true, errorMessage: 'This field is required!'},
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
  if (file) {
    const filePath = "/nft/" + file.filename;
    data.thumbnail = await makeThumbnail(file);
    data.media = filePath;
    data.mine_type = file.mimetype;
  } else {
    ctx.body = { media: { param: "media", msg: "This field is required!" } };
    ctx.status = 400;
    return;
  }
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

const getNFTTop = async (ctx) => {
  const nft = await nftModel.getNFTTop();
  ctx.body = nft;
};

const nftHistory = async (ctx, next) => {
  const { tokenId } = ctx.params;
  const res = await historyModel.historyTransfer(tokenId);
  ctx.body = res
  return next()
}

const listNft = async (ctx, next) => {
  const {
    category,
    name,
    owner,
    status,
    page,
    limit,
    sort_by = "id",
    order_by = "desc",
  } = ctx.request.query;
  const conditions = [
    ['owner', owner],
    ['status', 'in', status ? status.split(",") : null],
    ['category_id', 'in', category ? category.split(",") : null],
    ['name', 'like', name ? `%${name}%` : null],
  ];
  const orderBy = {
    field: sort_by,
    type: order_by,
  };
  const nft = await nftModel.getList(conditions, orderBy, limit, page);
  ctx.body = nft;
  return next();
};

module.exports = { mint, nftHistory, detailNft, listNft, getNFTTop };
