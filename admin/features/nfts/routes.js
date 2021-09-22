const nftMiddleware = require('./commands/manager-nft');

module.exports = (router, middlewares = []) => {
  router.get('/nfts', middlewares.map(middleware => middleware), (req, res) => res.render('pages/nfts'));
  router.get('/api/nfts', middlewares.map(middleware => middleware), nftMiddleware.listNft);
  router.post('/nfts/toggle', middlewares.map(middleware => middleware), nftMiddleware.toggleStatus);

  return router;
};
