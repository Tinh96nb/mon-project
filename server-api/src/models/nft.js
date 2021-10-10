const knex = require('./connect');
const userModel = require("./users");
const { web3 } = require('../helper/web3');

const { statusNft, eventHistoryNFT } = require('../helper/const');

const mintNft = async (data) => {
  try {
    data.status = statusNft.pendding;
    data.author = data.owner;
    await knex('nfts').insert(data);
    const result = await knex('nfts').where('token_id', data.token_id).first();
    return {
      success: true,
      message: 'Create success!',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Create fail!',
      data: error,
    };
  }
};

const verifyNft = async (tokenId, owner, txid) => {
  try {
    const nft = await knex('nfts').where({ token_id: tokenId, owner }).first();
    if (!nft || nft.status == statusNft.verified) {
      return {
        success: false,
        message: 'NFT is verified!',
        data: {tokenId},
      };
    }
    await knex('nfts').where({ token_id: tokenId }).update({ status: statusNft.verified });
    await knex('nft_histories').insert({
      token_id: tokenId,
      to: nft.owner,
      type: eventHistoryNFT.listing,
      txid
    });
    return {
      success: true,
      message: 'Token verify minted!',
      data: tokenId,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error verify NFT!',
      data: error.message,
    };
  }
};

const transferNFT = async (tokenId, from, to, txid) => {
  try {
    const nft = await knex('nfts').where({ token_id: tokenId, owner: from }).first();
    if (!nft || +nft.status !== statusNft.verified) {
      return {
        success: false,
        message: 'Not found NFT or duplicate event!',
        data: {tokenId},
      };
    }

    const getTo = await knex('users').where({address: to}).first();
    if (!getTo) {
      await userModel.createUser({address: to});
    }

    await knex('nfts').where({ token_id: tokenId }).update({
      owner: to,
      status: statusNft.verified

    });
    await knex('nft_histories').insert({
      token_id: tokenId,
      from: nft.owner,
      to,
      type: eventHistoryNFT.other,
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
      message: 'Error transfer nft!',
      data: error.message,
    };
  }
};

const confirmPriceSell = async (tokenId, seller, price) => {
  try {
    const nft = await knex('nfts').where({ token_id: tokenId, owner: seller }).first();
    if (!nft) {
      return {
        success: false,
        message: 'Not found NFT!',
        data: {tokenId},
      };
    }
    await knex('nfts').where({ token_id: tokenId })
      .update({
        status: statusNft.selling,
        price: web3.utils.fromWei(price, "ether"),
        sell_at: knex.fn.now()
      })
    return {
      success: true,
      message: 'Confirm price done!',
      data: tokenId,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error confirm price!',
      data: error.message,
    };
  }
}

const cancelOrder = async (tokenId) => {
  try {
    const nft = await knex('nfts').where({ token_id: tokenId, status: statusNft.selling }).first();
    if (!nft) {
      return {
        success: false,
        message: 'Not found NFT or not selling!',
        data: {tokenId},
      };
    }
    await knex('nfts').where({ token_id: tokenId }).update({ status: statusNft.verified })
    return {
      success: true,
      message: 'Cancel order successfully!',
      data: tokenId,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error cancel order nft!',
      data: error.message,
    };
  }
}

const getByTokenId = async (tokenId) => {
  const nfts = await knex('nfts').where('token_id', tokenId);
  if (!nfts) return {};
  const result = await addProperty(nfts);
  return result.length ? result[0]: {};
};

const getNFTTop = async () => {
  let nft = null;
  const nftConfig = await knex('system_config').where({name: 'nft'}).first();
  if (nftConfig && nftConfig.value) {
    const detail = await knex('nfts').where({token_id: nftConfig.value, status: statusNft.selling}).first();
    if (!detail) {
      nft = await nftSalest();
    } else nft = detail;
  } else {
    nft = await nftSalest();
  }
  if (!nft) return null;
  return getByTokenId(nft.token_id);
}

const nftSalest = () => {
  return knex('nft_histories')
  .sum('nft_histories.price as price')
  .select('nft_histories.token_id as token_id')
  .join('nfts', 'nft_histories.token_id', 'nfts.token_id')
  .where('nft_histories.type', eventHistoryNFT.sale)
  .where('nfts.status', statusNft.selling)
  .groupBy('token_id')
  .orderBy('price', 'desc')
  .limit(1)
  .first();
}

const getList = async (
  conditions = [],
  orderBy = null,
  limit = 12,
  page = 1
) => {
  const query = knex('nfts').select();
  conditions.forEach((condition) => {
    if (condition[condition.length - 1]) {
      if (condition.length === 2) query.andWhere(condition[0], condition[1]);
      if (condition.length === 3) query.andWhere(condition[0], condition[1], condition[2]);
    }
  });
  const total = await query.clone().count('id as amount').first();
  if (limit) query.limit(limit);
  if (page) {
    const offset = limit * (page - 1);
    if (offset) query.offset(offset);
  }
  if (orderBy) {
    query.orderByRaw(`
      ${orderBy.field === 'price' ? `${orderBy.field}+0`: orderBy.field}
      ${orderBy.type}`
    )
  }
  const nfts = await query;
  const result = await addProperty(nfts);
  if (limit && page) {
    return {
      data: result,
      pagination: {
        current_page: +page,
        per_page: +limit,
        total: total.amount,
        last_page: Math.ceil(total.amount / limit),
      },
    };
  }
  return result;
};

const addProperty = async (listNft = []) => {
  const result = await Promise.all(
    listNft.map(async (nft) => {
      const category = await knex('categories').where('id', nft.category_id).first();
      const author = await userModel.getInfo({ address: nft.author });
      const owner = await userModel.getInfo({ address: nft.owner });
      const numHis = await knex('nft_histories').count('id as num')
        .where('token_id', nft.token_id)
        .whereRaw(`type != ${eventHistoryNFT.listing}`).first();
      const totalVol = await knex('nft_histories').sum('price as sum').where('token_id', nft.token_id).first();
      return {
        ...nft,
        author,
        owner,
        category_name: category ? category.name : '',
        total_vol: totalVol.sum,
        amount_trade: numHis.num
      };
    })
  );
  return result;
};

const updateNft = async (tokenId, data) => {
  try {
    const nft = await getByTokenId(tokenId);
    if (!nft) {
      return {
        success: false,
        message: 'Not found nft!',
        data: '',
      };
    }
    if (nft.owner != data.owner) {
      return {
        success: false,
        message: 'You not owner of NFT!',
        data: '',
      };
    }
    if (nft.status == statusNft.selling)
      return {
        success: false,
        message: 'NFT is being sellig or auctioned!',
        data: null,
      };
    await knex('nfts').where({ token_id: tokenId }).update(data);
    const result = await knex('nfts').where('token_id', tokenId).first();
    return {
      success: true,
      message: 'update success!',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: 'update fail!',
      data: error.message,
    };
  }
};

const setFeeCopyright = async (tokenId, fee) => {
  try {
    const nft = await knex('nfts').where({ token_id: tokenId }).first();
    if (!nft) {
      return {
        success: false,
        message: 'Not found NFT!',
        data: {tokenId},
      };
    }
    const realFee = +parseFloat((fee/1000).toString()).toFixed(2);
    await knex('nfts').where({ token_id: tokenId })
      .update({ feeCopyright: realFee })
    return {
      success: true,
      message: 'Set copyright success!',
      data: {tokenId, realFee},
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error set copyright!',
      data: error.message,
    };
  }
}

module.exports = {
  mintNft,
  getByTokenId,
  updateNft,
  verifyNft,
  getList,
  transferNFT,
  confirmPriceSell,
  cancelOrder,
  getNFTTop,
  setFeeCopyright
};
