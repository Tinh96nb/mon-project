const { recoverPersonalSignature } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const axios = require('axios');
const jwtHelper = require('../helper/jwt');
const usersModel = require('../models/users');
const cateModel = require('../models/category');

const login = async (ctx, next) => {
  const { signature, publicAddress } = ctx.request.body;
  if (!signature || !publicAddress) {
    ctx.status = 401;
    ctx.body = { message: 'Request should have signature and publicAddress' };
    return;
  }
  const user = await usersModel.getInfo({ address: publicAddress });
  if (!user) {
    ctx.status = 401;
    ctx.body = { message: 'Not found user!' };
    return;
  }
  // verify signature
  const msgBufferHex = bufferToHex(Buffer.from(String(user.nonce), 'utf8'));
  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });
  if (address.toLowerCase() !== publicAddress.toLowerCase()) {
    ctx.status = 401;
    ctx.body = { message: 'Signature verification failed' };
    return;
  }
  const newNonce = Math.floor(Math.random() * 10000);
  const res = await usersModel.updateByAddress(publicAddress, { nonce: newNonce });
  if (!res.success) {
    ctx.body = res;
    ctx.status = 400;
    return;
  }
  const token = await jwtHelper.generateToken({ payload: { user } });
  ctx.body = { token };
};

const getConfig = async (ctx, next) => {
  const configs = await cateModel.getConfig();
  let revert = {};
  configs.forEach((config) => {
    revert[config.name] = config;
  });
  ctx.body = revert;
};

const getPrice = async (ctx, next) => {
  const res = await axios(
    'https://web-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=16147'
  );
  const price = res.data.data[16147].quote.USD.price;
  ctx.body = parseFloat(price).toFixed(8);
};

module.exports = { login, getConfig, getPrice };
