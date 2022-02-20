const collectionsModel = require('../models/collections');

const list = async (ctx, next) => {
  const collections = await collectionsModel.getCollections({}, false);
  ctx.body = collections
  return next();
}

const detail = async (ctx, next) => {
  const { slug } = ctx.params;
  const collection = await collectionsModel.getCollections({ slug }, 1);
  ctx.body = collection
  return next();
}

const create = async (ctx, next) => {
  const { name, description, img_avatar_url, img_cover_url, user_id } = ctx.request.body;
  const collection = await collectionsModel.create({ name, description, img_avatar_url, img_cover_url, user_id });
  ctx.body = collection
  return next();
}

module.exports = { list, detail, create }