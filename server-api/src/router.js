const Router = require('koa-router');
const path = require("path");
const koaPart = require('koa-partial-content');

const userController = require('./controllers/user');
const nftController = require('./controllers/nft');
const cateController = require('./controllers/category');
const collectionsController = require('./controllers/collections');
const loginController = require('./controllers/login');

const { upload } = require('./middlewares/multer');
const { isAuth } = require('./middlewares/auth');

const userUploader = upload('upload/user');
const nftUploader = upload('upload/nft');
const collectionUploader = upload('upload/collection');

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
  router.get('/nfts/history/:tokenId', nftController.nftHistory);

  // categories
  router.get('/categories', cateController.list);
  router.get('/categories/:id', cateController.detail);

  // collections
  router.post('/collections', isAuth, async (ctx, next) => {
    const schema = {
      img_cover: { notEmpty: true, errorMessage: 'This field is required!'},
      img_avatar: { notEmpty: true, errorMessage: 'This field is required!'},
      name: { notEmpty: true, errorMessage: 'This field is required!'},
      description: { notEmpty: true, errorMessage: 'This field is required!'},
    };
    ctx.checkBody(schema);

  }, collectionUploader.array(['img_cover', 'img_avatar']), collectionsController.create);
  router.get('/collections', isAuth, collectionsController.list);
  router.get('/collections/:slug', isAuth, collectionsController.detail);

  router.get('/getprice', loginController.getPrice);

  return router;
};
