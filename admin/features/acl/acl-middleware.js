const { acl } = require('./main');

const aclMiddleware = async (req, res, next) => {
  if (req.user && req.url !== '/login') {
    const result = await acl.isAllowed(
      req.user.id,
      req._parsedUrl.pathname,
      req.method.toLowerCase()
    );
    const userRoles = await acl.userRoles(req.user.id);
    req.user['roles'] = userRoles
    if (!result) {
      return res.status(403).render('pages/403');
    }
    return next();
  }
  return next();
};
module.exports = aclMiddleware;
