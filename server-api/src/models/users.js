const knex = require('./connect');

const createUser = async (info) => {
  try {
	  const nonce = Math.floor(Math.random() * 10000);
    info.nonce = nonce;
    await knex('users').insert(info);
    const user = await getInfo({address: info.address});
    return {
      success: true,
      message: 'Create success',
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Update error!',
      data: error,
    };
  }
};

const updateByAddress = async (address, dataUpdate) => {
  const user = await knex('users').where('address', address).first();
  if (!user)
    return {
      success: false,
      message: 'Not found user',
      data: null,
    };
  try {
    await knex('users').where('address', address).update(dataUpdate);
    const userUpdated = await getInfo({ address });
    return {
      success: true,
      message: 'Update success!',
      data: userUpdated,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Update error!',
      data: error,
    };
  }
};

const getInfo = async (condition) => {
  const user = await knex('users').select().where(condition).first();
  if (!user) {
    return null;
  }
  const followers = await knex('favorites').count('id as num').where('to', user.address).first();
  const followings = await knex('favorites').count('id as num').where('user', user.address).first();
  const amountNFT = await knex('nfts').count('id as num').where('owner', address).first();
  return {
    ...user,
    followers: followers.num,
    followings: followings.num,
    amountNFT: amountNFT.num
  }
};

const toggleFavorite = async (from, to) => {
  try {
    const res = await knex('favorites').where({user: from, to}).first();
    if (res) {
      await knex('favorites').where({user: from, to}).del();
      return {
        success: true,
        message: 'Unfavorite success!',
        data: null,
      };
    }
    await knex('favorites').insert({user: from, to});
    return {
      success: true,
      message: 'Add favorite success!',
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error Toggle!',
      data: error.message,
    };
  }
};

module.exports = {
  createUser,
  updateByAddress,
  getInfo,
  toggleFavorite
};
