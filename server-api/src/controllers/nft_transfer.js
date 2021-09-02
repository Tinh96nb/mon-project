const historyModel = require('../models/nft_history');
const { eventHistoryNFT } = require('../helper/const');

const endAuction = async (ctx, next) => {
  const { body }  = ctx.request
  const schema = {
    token_id: {notEmpty: true, errorMessage: 'This field is required!'},
    from: {notEmpty: true, errorMessage: 'This field is required!'},
    to: {notEmpty: true, errorMessage: 'This field is required!'},
    txid: {notEmpty: true, errorMessage: 'This field is required!'},
  };
  ctx.checkBody(schema);
  const errors = await ctx.validationErrors(true);
  if (errors) {
    ctx.body = errors;
    ctx.status = 400;
    return;
  }
  body.event = eventHistoryNFT.auction;
  const res = await historyModel.createHistory(body);
  if (!res.success) {
    ctx.body = res;
    ctx.status = 400;
    return;
  }
  ctx.body = res
  return next()
}

const nftHistory = async (ctx, next) => {
  const { tokenId } = ctx.params;
  const { range } = ctx.request.query;
  const res = await historyModel.historyTransfer(tokenId, range);
  ctx.body = res
  return next()
}

const listBidCurrent = async (ctx, next) => {
  const { tokenId } = ctx.params;
  const res = await historyModel.listBidCurrent(tokenId);
  ctx.body = res
  return next()
}

module.exports = { endAuction, listBidCurrent, nftHistory }