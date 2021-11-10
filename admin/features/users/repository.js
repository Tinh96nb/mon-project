const knex = require('../../db');

async function getList(conditions = {}) {
  const query = knex('users');
  if (conditions) {
    query.where(conditions);
  }
  const users = await query;
  const result = await Promise.all(
    users.map(async (user) => {
      const numNFT = await knex('nfts').where('owner', user.address).count('id as amount').first();
      const res = await knex('nft_histories')
      .sum('price as totalTrade')
      .count('id as numTrade')
      .whereRaw(`
        type = 2
        AND
          (nft_histories.from = '${user.address}' OR nft_histories.to = '${user.address}')
      `)
      .first();
      return {
        ...user,
        amountNFT: numNFT ? numNFT.amount : 0,
        totalTrade: `${res.totalTrade || 0} MON`,
        numTrade: res.numTrade || 0
      };
    })
  );
  return result;
}

async function toggleUser(id) {
  try {
    const user = await knex('users')
      .where({id})
      .first();
    if (!user) {
      return {
        success: false,
        message: 'Not found user!',
        data: null,
      };
    }
    await knex('users')
      .where({id})
      .update({status: !user.status});
    return {
      success: true,
      message: 'Change status successfuly!',
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Server error!',
      data: error.message,
    };
  }
}

async function toggleVerify(id) {
  try {
    const user = await knex('users')
      .where({id})
      .first();
    if (!user) {
      return {
        success: false,
        message: 'Not found user!',
        data: null,
      };
    }
    await knex('users')
      .where({id})
      .update({verify: !user.verify});
    return {
      success: true,
      message: 'Change verify successfuly!',
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Server error!',
      data: error.message,
    };
  }
}
module.exports = {
  getList,
  toggleUser,
  toggleVerify
};
