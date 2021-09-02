const collectionModel = require('../models/collection');

const list = async (ctx, next) => {
  const cates = await collectionModel.getCategory({}, false);
  ctx.body = cates
  return next();
}

const detail = async (ctx, next) => {
  const { id } = ctx.params;
  const category = await collectionModel.getCategory({id});
  ctx.body = category
  return next();
}

module.exports = { list, detail }