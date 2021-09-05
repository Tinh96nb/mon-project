const Router = require('koa-router');

const userController = require('./controllers/user');
const nftController = require('./controllers/nft');
const cateController = require('./controllers/category');
const loginController = require('./controllers/login');

const { upload } = require('./middlewares/multer');
const { isAuth } = require('./middlewares/auth');
const userUploader = upload('upload/user');
const nftUploader = upload('upload/nft');

const { userUpload } = require('./helper/const');

module.exports = function () {
  const router = new Router();
  router.get('/ping', (ctx) => (ctx.body = 'bong'));
  router.post('/login', loginController.login);
  // for user
  router.put('/users', isAuth, userUploader.fields(userUpload), userController.updateUser);
  router.get('/users/:address', userController.getUser);
  router.post('/users/toggle-favorite', isAuth, userController.favorite);

  // for nft
  router.get('/nfts', nftController.listNft);
  router.post('/nfts/mint', isAuth, nftUploader.single('media'), nftController.mint);
  router.get('/nfts/:tokenId', nftController.detailNft);
  router.get('/nfts/history/:tokenId', nftController.nftHistory);

  // categories
  router.get('/categories', cateController.list);
  router.get('/categories/:id', cateController.detail);

  return router;
};
