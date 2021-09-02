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
  if (file) data.media = "/nft/" + file.filename;
  else {
    ctx.body = { media: { params: "media", msg: "media is required!" } };
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
  const { call_by } = ctx.request.query
  const nft = await nftModel.getByTokenId(tokenId, call_by);
  ctx.body = nft;
};

const listNft = async (ctx, next) => {
  const {
    category,
    collection,
    name,
    owner,
    status,
    priceFrom,
    priceTo,
    page,
    limit,
    call_by,
    approve_price,
    sort_by = "id",
    order_by = "desc",
  } = ctx.request.query;
  const conditions = [
    ['owner', owner],
    ['status', status],
    ['category_id', 'in', category ? category.split(",") : null],
    ['collection_id', 'in', collection ? collection.split(",") : null],
    ['name', 'like', name ? `%${name}%` : null],
    ['price', '<=', priceTo],
    ['price', '>=', priceFrom],
  ];
  if (approve_price !== 'all') {
    conditions.push(['approve_price', 1]);
  }
  const orderBy = {
    field: sort_by,
    type: order_by,
  };
  const nft = await nftModel.getList(conditions, orderBy, limit, page, call_by);
  ctx.body = nft;
  return next();
};

module.exports = { mint, updateNft, detailNft, listNft };
