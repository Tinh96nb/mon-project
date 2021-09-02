const usersModel = require('../models/users');

const updateUser = async (ctx) => {
  const { address } = ctx.state.user;
  const { body, files }  = ctx.req
  ctx.request.body = { ...body }

  const schema = {
    username: {},
    twitter: {},
    facebook: {},
    instagram: {},
    bio: {},
    email: {
      optional: true,
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    },
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
    if (body[field] && body[field] !== undefined) data[field] = body[field]
  })
  if (files && files.avatar) data.avatar = '/user/'+files.avatar[0].filename
  if (files && files.cover) data.cover = '/user/'+files.cover[0].filename
  const res = await usersModel.updateByAddress(address, data);
  if (!res.success) {
    ctx.body = res;
    ctx.status = 400;
    return;
  }
  ctx.body = res.data
}

const getUser = async (ctx) => {
  const { address } = ctx.params;
  ctx.checkParams('address', 'Address is invalid!').notEmpty().isAlphanumeric();
  const errors = await ctx.validationErrors(true);
  if (errors) {
    ctx.body = errors;
    ctx.status = 400;
    return;
  }
  let res = await usersModel.getInfo({address});
  if (!res) {
    res = await usersModel.createUser({address});
    if (!res.success) {
      ctx.body = res;
      ctx.status = 400;
      return;
    }
    res = res.data
  }
  ctx.body = res;
}

const favorite = async (ctx) => {
  const { to } = ctx.body;
  if (!to) {
    ctx.body = { message: "Param To must be required!"};
    ctx.status = 400;
    return;
  }
  const { address } = ctx.state.user;
  const res = await usersModel.toggleFavorite(address);
  ctx.body = res
}

module.exports = { updateUser, getUser, favorite }