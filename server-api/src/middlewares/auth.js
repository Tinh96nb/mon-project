const jwtHelper = require('../helper/jwt');

const isAuth = async (ctx, next) => {
  if (!ctx.request.header || !ctx.request.header.authorization) {
    ctx.body = { message: 'No token provided!' };
    ctx.status = 401;
    return;
  }
  const tokenFromClient = ctx.request.header.authorization.split(' ')[1].trim();
  try {
    const userFromToken = await jwtHelper.verifyToken(tokenFromClient);
    ctx.state.user = userFromToken.payload.user;
    return next();
  } catch (error) {
    ctx.body = { message: 'Unauthorized!' };
    ctx.status = 401;
    return;
  }
};
module.exports = {
  isAuth,
};
