const knex = require('./connect');

const createCollection = async (data) => {
  try {
    const result = await knex('collections').insert(data);
    const col = await knex('collections').select().where('id', result[0]).first();
    return {
      success: true,
      message: 'create success!',
      data: col,
    };
  } catch (error) {
    return {
      success: false,
      message: 'create error!',
      data: error,
    };
  }
};

const getCollection = async (conditions, orderBy = null, limit = null, page = null) => {
  const query = knex('collections').select();
  conditions.forEach((condition) => {
    if (condition[condition.length - 1]) {
      if (condition.length === 2) query.andWhere(condition[0], condition[1]);
      if (condition.length === 3) query.andWhere(condition[0], condition[1], condition[2]);
    }
  });
  if (orderBy) {
    query.orderBy(orderBy.field, orderBy.type);
  }
  if (limit) query.limit(limit);
  if (page) {
    const offset = limit * (page - 1);
    if (offset) query.offset(offset);
  }
  const cols = await query;

  const result = await Promise.all(
    cols.map(async (col) => {
      const numItem = await knex('nfts').count('id as num').where('collection_id', col.id).first();
      const user = await knex().table('users').where('address', col.owner).first();
      return { ...col, amountNFT: numItem.num, owner: user };
    })
  );
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
  if (limit === 1 && result.length === 1) return result[0];
  return result;
};

const updateCollection = async (id, address, data) => {
  const col = await knex('collections').where('id', id).first();
  if (!col)
    return {
      success: false,
      message: 'Not found collection!',
      data: null,
    };
  if (col.owner != address)
    return {
      success: false,
      message: 'You not owner collection!',
      data: null,
    };
  try {
    await knex('collections').where({ id }).update(data);
    const colect = await knex('collections').where('id', id).first();
    return {
      success: true,
      message: 'Update success!',
      data: colect,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Update error!',
      data: error,
    };
  }
};

const getCategory = async (condition, limit = 1) => {
  const query = knex('categories').where(condition);
  if (limit) query.limit(limit);
  if (limit === 1) return query.first();
  return query;
};

module.exports = {
  createCollection,
  getCollection,
  updateCollection,
  getCategory,
};
