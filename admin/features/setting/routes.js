const controlle = require('./index');

module.exports = (router, middlewares = []) => {
  router.get('/system-config', middlewares.map(middleware => middleware), controlle.renderPage);
  router.post('/update-config', middlewares.map(middleware => middleware), controlle.updateSetting);
  router.post('/update-footer', middlewares.map(middleware => middleware), controlle.updateFooter);
  return router;
};
