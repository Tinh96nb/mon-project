const usersPage = require('./commands/manager-user');

module.exports = (router, middlewares = []) => {
  router.get(
    '/users',
    middlewares.map(middleware => middleware),
    (req, res) => res.render('pages/users')
  );
  router.get(
    '/api/users',
    middlewares.map(middleware => middleware),
    usersPage.listUser
  );
  router.post(
    '/users/toggle-user',
    middlewares.map(middleware => middleware),
    usersPage.toggleUser
  );
  router.post(
    '/users/toggle-verify',
    middlewares.map(middleware => middleware),
    usersPage.toggleVerifyUser
  );

  return router;
};
