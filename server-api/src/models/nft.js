const knex = require('./connect');
const userModel = require("./users");

const { statusNft, statusKYC, statusAuction, eventHistoryNFT, statusOrderbook } = require('../helper/const');

const STATUS_PENDDING_PRICE = 0;

const mintNft = async (data) => {
  try {
    const userKyc = await knex('user_kyc').where('wallet', data.owner).first();
    if (!userKyc || userKyc.status != statusKYC.approve)
      return {
        success: false,
        message: 'You must be to do KYC!',
        data: {},
      };
    const col = await knex('collections')
      .where('owner', data.owner)
      .andWhere('id', data.collection_id)
      .first();
    if (!col)
      return {
        success: false,
        message: 'You are not the owner of this collection!',
        data: {},
      };
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
      price: 0,
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
      status: statusNft.verified,
      approve_price: null,
      collection_id: null,
    });
    await knex('nft_histories').insert({
      token_id: tokenId,
      from: nft.owner,
      to,
      event: eventHistoryNFT.other,
      price: 0,
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

const getByTokenId = async (tokenId, call_by = null) => {
  const nfts = await knex('nfts').select().where('token_id', tokenId);
  if (!nfts) return null;
  const result = await addProperty(nfts, call_by);
  return result[0];
};

const getList = async (
  conditions = [],
  orderBy = null,
  limit = null,
  page = null,
  call_by = null
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
  const result = await addProperty(nfts, call_by);
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

const addProperty = async (listNft = [], call_by) => {
  const result = await Promise.all(
    listNft.map(async (nft) => {
      const countView = await knex('nft_summary')
        .count('id as num')
        .where('token_id', nft.token_id)
        .andWhere('type', 1)
        .first();
      const countFa = await knex('nft_summary')
        .count('id as num')
        .where('token_id', nft.token_id)
        .andWhere('type', 0)
        .first();
      const category = await knex('categories').where('id', nft.category_id).first();
      const col = await knex('collections').where('id', nft.collection_id).first();
      const author = await knex('users').where('address', nft.author).first();
      const owner_info = await knex('users').where('address', nft.owner).first();
      let data = {
        ...nft,
        author,
        owner_info,
        view: countView.num,
        favorite: countFa.num,
        category_name: category ? category.name : '',
        collection_name: col ? col.name : '',
      };
      if (nft.status == statusNft.auction) {
        const auction = await knex('auctions')
          .where('token_id', nft.token_id)
          .andWhere('status', 'in', [statusAuction.active, statusAuction.pendding])
          .first();
        if (auction) {
          const auctionData = {
            start_time: auction.start_time,
            end_time: auction.end_time,
            lasted_bid: null
          };
          const lastedBid = await knex('bids')
            .where('auction_id', auction.id)
            .orderBy('price', 'desc')
            .first();
          if (lastedBid) auctionData.lasted_bid = lastedBid.price;
          data = {
            ...data,
            auction: auctionData
          };
        }
      }
      if (nft.status == statusNft.orderBook) {
        const orderbook = await knex('nft_orderbook')
          .where('token_id', nft.token_id)
          .first();
        if (orderbook) {
          data.orderbook = orderbook;
        }
      }
      if (call_by) {
        const isFavorite = await knex('nft_summary')
          .where({ address: call_by, token_id: data.token_id, type: 0 })
          .first();
        data.isFavorite = isFavorite ? true : false;
      }
      return data;
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
    if (nft.status == statusNft.selling || nft.status == statusNft.auction)
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

const verifyExchange = async (tokenId, symbol, tokenAddress, pairSymbol) => {
  try {
    const order = await knex('nft_orderbook')
      .where({ token_id: tokenId, symbol, status: statusOrderbook.pendding }).first();
    if (!order) {
      return {
        success: false,
        message: 'Not found order book!',
        data: {token: tokenId, symbol},
      };
    }
    await knex('nft_orderbook').where({ token_id: tokenId, symbol }).update({
      address: tokenAddress,
      pair_symbol: pairSymbol,
      status: statusOrderbook.deloyed
    });
    return {
      success: true,
      message: 'Confirm order book success!',
      data: {token: tokenId, symbol},
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error order book!',
      data: error.message,
    };
  }
}

const setPrice = async (params, owner) => {
  const { type, price, token_id, start_time, end_time } = params;
  if (!type || (type != 3 && !price) || !token_id) {
    return {
      success: false,
      message: 'Please fill in all the required fields!',
      data: null,
    };
  }
  // type 1 selling, 2 auction
  const status = type == 1 ? statusNft.selling : type == 2 ? statusNft.auction : statusNft.orderBook;
  try {
    const nft = await knex('nfts').where({ token_id }).first();
    if (!nft)
      return {
        success: false,
        message: 'Not found nft!',
        data: null,
      };
    if (nft.owner != owner)
      return {
        success: false,
        message: 'You not owner NFT!',
        data: null,
      };
    if (nft.status != statusNft.verified)
      return {
        success: false,
        message: 'NFT not available!',
        data: null,
      };
    if (nft.approve_price == STATUS_PENDDING_PRICE)
      return {
        success: false,
        message: 'Price waiting for approval!',
        data: null,
      };
    if (status == statusNft.selling)
      await knex('nfts')
        .where({ token_id })
        .update({ price, approve_price: STATUS_PENDDING_PRICE, status });
    if (status == statusNft.auction) {
      if (!start_time || !end_time) {
        return {
          success: false,
          message: 'Please fill in all the required fields!',
          data: null,
        };
      }
      await knex('nfts')
        .where({ token_id })
        .update({ price, approve_price: STATUS_PENDDING_PRICE, status });
      await knex('auctions').insert({
        owner: nft.owner,
        token_id,
        start_time,
        end_time,
        price,
      });
    }

    if (status == statusNft.orderBook) {
      await knex('nfts')
        .where({ token_id })
        .update({ approve_price: STATUS_PENDDING_PRICE, status });
      delete params.status
      delete params.price
      delete params.type
      await knex('nft_orderbook').insert(params);
    }
    return {
      success: true,
      message: 'Set price success!',
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Set price error!',
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
  setPrice,
  transferNFT,
  verifyExchange
};
