const middleware = require('./commands/manager-categories');

module.exports = (router, middlewares = []) => {
  router.get('/categories', middleware.listCategories);
  router.get('/categories/list', middleware.listCategoriesJson);
  router.post('/categories', middleware.createItem);
  router.delete('/categories', middleware.deleteItem);
  router.put('/categories', middleware.editItem);
  return router;
};
