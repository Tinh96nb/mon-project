const knex = require('./connect');
const { web3 } = require('../helper/web3');
const { statusNft } = require('../helper/const');

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

const historyTransfer = async (tokenId) => {
  const histories = await knex('nft_histories').where('token_id', tokenId).orderBy('created_at', 'desc');
  const result = await Promise.all(
    histories.map(async (history) => {
      const from = await knex('users').where('address', history.from).first();
      const to = await knex('users').where('address', history.to).first();
      return {
        ...history,
        from: from ? from : null,
        to: to ? to : null,
      };
    })
  );
  return result;
}

module.exports = {
  historyTransfer,
  createHistory
};
