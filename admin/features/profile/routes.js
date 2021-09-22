const { wrap } = require('async-middleware');

const {validateChangePasswordPayload, validateRegisterPayload} = require('./commands/verify-request-body');
const updateUserInfo = require('./commands/update-user-info');
const changePassword = require('./commands/change-password');

const loadPage = require('./commands/load-page');

module.exports = (router, middlewares = []) => {
  router.get('/profile', middlewares.map(middleware => wrap(middleware)), wrap(loadPage));

  router.post('/update-profile-info', wrap(validateRegisterPayload), wrap(updateUserInfo));
  router.post('/update-password', wrap(validateChangePasswordPayload), wrap(changePassword));
  return router;
};
