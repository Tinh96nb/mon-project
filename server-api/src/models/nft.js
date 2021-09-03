const knex = require('./connect');
const userModel = require("./users");

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
        data: {},
      };
    }
    await knex('nfts').where({ token_id: tokenId }).update({ status: statusNft.verified });
    await knex('nft_histories').insert({
      token_id: tokenId,
      to: nft.owner,
      event: eventHistoryNFT.listing,
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

const getByTokenId = async (tokenId) => {
  const nfts = await knex('nfts').select().where('token_id', tokenId);
  if (!nfts) return null;
  const result = await addProperty(nfts);
  return result.length ? result[0]: null;
};

const getList = async (
  conditions = [],
  orderBy = null,
  limit = null,
  page = null
) => {
  const query = knex('nfts').select();
  conditions.forEach((condition) => {
    if (condition[condition.length - 1]) {
      if (condition[condition.length - 1][0] !== 'none') {
        if (condition.length === 2) query.andWhere(condition[0], condition[1]);
        if (condition.length === 3) query.andWhere(condition[0], condition[1], condition[2]);
      } else {
        query.whereRaw(`${condition[0]} is null`)
      }
    }
  });
  if (limit) query.limit(limit);
  if (page) {
    const offset = limit * (page - 1);
    if (offset) query.offset(offset);
  }
  if (orderBy) {
    query.orderBy(orderBy.field, orderBy.type);
  }
  const nfts = await query;
  const result = await addProperty(nfts);
  if (limit && page) {
    const total = result.length;
    return {
      data: result,
      pagination: {
        current_page: +page,
        per_page: +limit,
        total: total,
        last_page: Math.ceil(total / limit),
      },
    };
  }
  return result;
};

const addProperty = async (listNft = []) => {
  const result = await Promise.all(
    listNft.map(async (nft) => {
      const category = await knex('categories').where('id', nft.category_id).first();
      const author = await knex('users').where('address', nft.author).first();
      const owner = await knex('users').where('address', nft.owner).first();
      return {
        ...nft,
        author,
        owner,
        category_name: category ? category.name : '',
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

module.exports = {
  mintNft,
  getByTokenId,
  updateNft,
  verifyNft,
  getList,
  transferNFT
};
