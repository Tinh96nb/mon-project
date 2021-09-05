const cateModel = require('../models/category');

const list = async (ctx, next) => {
  const cates = await cateModel.getCategory({}, false);
  ctx.body = cates
  return next();
}

const detail = async (ctx, next) => {
  const { id } = ctx.params;
  const category = await cateModel.getCategory({id});
  ctx.body = category
  return next();
}

module.exports = { list, detail }