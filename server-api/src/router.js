const Router = require('koa-router');
const path = require("path");
const koaPart = require('koa-partial-content');

const userController = require('./controllers/user');
const nftController = require('./controllers/nft');
const cateController = require('./controllers/category');
const collectionsController = require('./controllers/collections');
const loginController = require('./controllers/login');
const botController = require('./controllers/bot');

const { upload } = require('./middlewares/multer');
const { isAuth } = require('./middlewares/auth');

const userUploader = upload('upload/user');
const nftUploader = upload('upload/nft');
const collectionUploader = upload('upload/collections')

const { userUpload } = require('./helper/const');
const part = new koaPart(path.resolve(__dirname, "../public/upload/"))

module.exports = function () {
  const router = new Router();
  // chunk video
  router.get('/nft/:path', part.middleware())

  router.get('/ping', (ctx) => (ctx.body = 'bong'));
  router.post('/login', loginController.login);
  router.get('/config', loginController.getConfig);
  // for user
  router.put('/users', isAuth, userUploader.fields(userUpload), userController.updateUser);
  router.get('/users', userController.getList);
  router.get('/users/all', userController.allUser);
  router.get('/users/:address', userController.getUser);
  router.post('/users/toggle-favorite', isAuth, userController.favorite);

  // for nft
  router.get('/nfts', nftController.listNft);
  router.post('/nfts/mint', isAuth, nftUploader.single('media'), nftController.mint);
  router.get('/nfts/top', nftController.getNFTTop);
  router.get('/nfts/:tokenId', nftController.detailNft);
  router.put('/nfts/:tokenId', isAuth, nftController.editNft);
  router.get('/nfts/history/:tokenId', nftController.nftHistory);

  // categories
  router.get('/categories', cateController.list);
  router.get('/categories/:id', cateController.detail);

  // collections
  router.get('/collections', collectionsController.list);
  router.post('/collections/create', isAuth, collectionUploader.fields([
    { name: 'img_cover_url', maxCount: 1 },
    { name: 'img_avatar_url', maxCount: 1 },
  ]),
  collectionsController.create);
  router.put('/collections/:id', isAuth, collectionUploader.fields([
    { name: 'img_cover_url', maxCount: 1 },
    { name: 'img_avatar_url', maxCount: 1 },
  ]),
  collectionsController.update);
  router.get('/collections/:slug', collectionsController.detail);

  router.get('/getprice', loginController.getPrice);

  router.get("/signal", botController.pushEvent);

  return router;
};
