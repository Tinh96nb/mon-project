const main = require('./main');
const memberRole = require('./member-role');
const passRouters = require('./get-router-middleware');

module.exports = (router, middlewares = []) => {

  router.get('/acls', middlewares.map(middleware => middleware), main.renderPage);
  router.get('/acls/api-resource', middlewares.map(middleware => middleware), passRouters(router), main.getResource);
  router.post('/acls/manager-role', middlewares.map(middleware => middleware), main.managerRole);
  router.post('/acls/manager-resource', middlewares.map(middleware => middleware), main.managerResource);

  router.get('/roles', middlewares.map(middleware => middleware), memberRole.renderPage);
  router.post('/roles', middlewares.map(middleware => middleware), memberRole.managerUserRole);
  router.post('/create-member', middlewares.map(middleware => middleware), memberRole.createMember);
  router.post('/toggle-status', middlewares.map(middleware => middleware), memberRole.toggeStatus);

  return router;
};
