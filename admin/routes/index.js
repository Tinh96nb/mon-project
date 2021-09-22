const express = require('express');
const router = express.Router();
const aclMiddleware = require('../features/acl/acl-middleware');

const mountLoginRoutes = require('../features/login/routes');
const mountLogoutRoutes = require('../features/logout/routes');
const mountProfileRoutes = require('../features/profile/routes');
const usersRoutes = require('../features/users/routes');
const nftsRoutes = require('../features/nfts/routes');
const categoriesRoutes = require('../features/categories/routes');
const aclRoutes = require('../features/acl/routes');
const homeRoutes = require('../features/dashboard');
const settingRoutes = require('../features/setting/routes');


router.use(aclMiddleware)
router.use((req, res, next) => {
  if (req.session) {
    res.locals.messages = req.session.messages;
    res.locals.userInfo = req.user ? req.user : null;
    req.session.messages = {};
  }
  return next();
});

function isAuthenticated(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

homeRoutes(router, [isAuthenticated]);
mountLoginRoutes(router);
mountLogoutRoutes(router, [isAuthenticated]);
mountProfileRoutes(router, [isAuthenticated]);
usersRoutes(router, [isAuthenticated]);
nftsRoutes(router, [isAuthenticated]);
categoriesRoutes(router, [isAuthenticated]);
aclRoutes(router, [isAuthenticated]);
settingRoutes(router, [isAuthenticated]);

module.exports = router;
