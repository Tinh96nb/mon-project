const knex = require('../../db');

async function getList(conditions = {}) {
  const query = knex('categories').orderBy('created_at', 'desc');
  if (conditions) {
    query.where(conditions);
  }
  const data = await query;
  const result = await Promise.all(
    data.map(async (cate) => {
      const numNFT = await knex('nfts').where('category_id', cate.id).count('id as amount').first();
      return {
        ...cate,
        amountNFT: numNFT ? numNFT.amount : 0,
      };
    })
  );
  return result;
}

async function create({ name }) {
  try {
    const create = await knex('categories').insert({ name });
    if (!create) {
      return { success: false, message: 'Create error.' };
    }
    return { success: true, message: 'Success.' };
  } catch (error) {
    return { success: false, message: 'Create error.' };
  }
}

async function edit({ id, name }) {
  try {
    const edit = await knex('categories')
      .where('id', id)
      .update({ name });
    if (!edit) {
      return { success: false, message: 'Edit error.' };
    }
    return { success: true, message: 'Success.' };
  } catch (error) {
    return { success: false, message: 'Edit error.' };
  }
}

async function deleteItem(id) {
  try {
    const deleteKnex = await knex('categories')
      .where('id', id)
      .del();
    if (!deleteKnex) {
      return { success: false, message: 'Delete error.' };
    }
    return { success: true, message: 'Success.' };
  } catch (error) {
    return { success: false, message: 'Delete error.' };
  }
}

module.exports = {
  getList,
  create,
  edit,
  deleteItem,
};
