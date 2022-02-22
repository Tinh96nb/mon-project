const collectionsModel = require('../models/collections');
const knex = require('../models/connect');

const list = async (ctx, next) => {
  const collections = await collectionsModel.getCollections({
    user_id: ctx.state.user.id
  }, false);
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
  const { body, files } = ctx.req;
  ctx.request.body = { ...body, img_avatar_url: files.img_avatar_url, img_cover_url: files.img_cover_url };
  const schema = {
    img_avatar_url: { notEmpty: true, errorMessage: 'This field is required!'},
    img_cover_url: { notEmpty: true, errorMessage: 'This field is required!'},
    name: { notEmpty: true, errorMessage: 'This field is required!'},
    description: { notEmpty: true, errorMessage: 'This field is required!'},
  };
  ctx.checkBody(schema);
  const errors = await ctx.validationErrors(true);
  Object.keys(files).forEach((field) => {
    if (files[field][0].size === 0 || files[field][0].size > 3000000) {
      errors[field] = { param: field, msg: "This field is invalid!" };
    }
  });
  if (errors) {
    ctx.body = errors;
    ctx.status = 400;
    return;
  }

  const banner = files.img_cover_url[0];
  const avatar = files.img_avatar_url[0];

  data = {};
  data.img_avatar_url = `/collections/${avatar.filename}`;
  data.img_cover_url = `/collections/${banner.filename}`;
  data.name = body.name;
  data.description = body.description;
  data.user_id = ctx.state.user.id;
  data.slug = body.name.toLowerCase().replace(/\s/g, '-') + '-' + Date.now();

  const collection = await collectionsModel.create(data);
  ctx.body = collection;
  return next();
}

async function update(ctx, next) {
  const collection = await knex('collections').where({ id: ctx.params.id, user_id: ctx.state.user.id }).first();
  if (!collection) {
    ctx.body = { message: 'Collection not found!' };
    ctx.status = 404;
    return next();
  }
  const { body, files } = ctx.req;
  ctx.request.body = { ...body };
  const schema = {
    name: { notEmpty: true, errorMessage: 'This field is required!'},
    description: { notEmpty: true, errorMessage: 'This field is required!'},
  };
  ctx.checkBody(schema);
  const errors = await ctx.validationErrors(true);
  Object.keys(files).forEach((field) => {
    if (files[field][0].size === 0 || files[field][0].size > 3000000) {
      errors[field] = { param: field, msg: "This field is invalid!" };
    }
  });
  if (errors) {
    ctx.body = errors;
    ctx.status = 400;
    return;
  }

  const banner = files.img_cover_url && files.img_cover_url.length ? files.img_cover_url[0] : null;
  const avatar = files.img_avatar_url && files.img_avatar_url.length ? files.img_avatar_url[0] : null;

  data = {};
  if (banner) {
    data.img_cover_url = `/collections/${banner.filename}`;
  }
  if (avatar) {
    data.img_avatar_url = `/collections/${avatar.filename}`;
  }

  data.name = body.name;
  data.description = body.description;

  const updatedCollection = await collectionsModel.update(
    ctx.params.id,
    ctx.state.user.id,
    data
  );

  ctx.body = updatedCollection;
  return next();
}

module.exports = { list, detail, create, update }