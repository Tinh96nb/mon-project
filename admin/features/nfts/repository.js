const knex = require('../../db');
const { statusNft } = require('../../helper/const');

async function getList(conditions = {}) {
  const query = knex('nfts');
  if (conditions) {
    query.where(conditions);
  }
  const data = await query;
  return addProperty(data);
}

const addProperty = async (listNft = []) => {
  const result = await Promise.all(
    listNft.map(async (nft) => {
      const category = await knex('categories').where('id', nft.category_id).first();
      return {
        ...nft,
        category_name: category ? category.name : '',
      };
    })
  );
  return result;
};

async function toggleSell({ token_id}) {
  try {
    const nft = await knex('nfts')
      .where({ token_id })
      .first();
    if (!nft) {
      return {
        success: false,
        message: 'Not found NFT!',
        data: null,
      };
    }
    // update nft
    const updateStt = nft.status == statusNft.selling ? statusNft.report : statusNft.selling
    await knex('nfts')
      .where({ token_id })
      .update({ status: updateStt });
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

module.exports = {
  getList,
  toggleSell,
};
