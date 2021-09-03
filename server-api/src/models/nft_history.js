const knex = require('./connect');
const { contract, web3 } = require('../helper/web3');
const { eventHistoryNFT, statusAuction, statusNft } = require('../helper/const');
const moment = require('moment');

const createHistory = async (buyer, tokenId, price, txid) => {
  try {
    const nft = await knex('nfts').where({ token_id: tokenId }).first();
    if (!nft || +nft.status === statusNft.verified) {
      return {
        success: false,
        message: 'Owner not set sell or aution',
        data: {tokenId},
      };
    }

    const getTo = await knex('users').where({address: buyer}).first();
    if (!getTo) {
      await userModel.createUser({address: buyer});
    }

    await knex('nfts').where({ token_id: tokenId }).update({
      owner: buyer,
      status: statusNft.verified,
      approve_price: null,
      collection_id: null,
    });
    await knex('nft_histories').insert({
      token_id: tokenId,
      from: nft.owner,
      to: buyer,
      event: nft.status,
      price: web3.utils.fromWei(price, "ether"),
      txid
    });
    return {
      success: true,
      message: 'Transfer nft success fully!',
      data: tokenId,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error!',
      data: error.message,
    };
  }
};

const historyTransfer = async (tokenId, range) => {
  const query = knex('nft_histories').where('token_id', tokenId);
  if (range) {
    const startDate = moment();
    const [amount, type] = range.split(',');
    startDate.subtract(amount, type);
    query.where('created_at', '>=', startDate.format('YYYY-MM-DD'));
  }
  const data = await query;
  const result = await Promise.all(
    data.map(async (history) => {
      const from = await knex('users').where('address', history.from).first();
      const to = await knex('users').where('address', history.to).first();
      let data = {
        ...history,
        from: from ? from : {},
        to: to ? to : {},
      };
      if (history.event == eventHistoryNFT.auction && history.ref_id) {
        const auction = await knex('auctions').where({ id: history.ref_id }).first();
        data = { ...data, auction: auction };
      }
      return data;
    })
  );
  return result;
}

module.exports = {
  historyTransfer,
  createHistory
};
