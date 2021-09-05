const knex = require('./connect');

const getCategory = async (condition, limit = 1) => {
  const query = knex('categories').where(condition);
  if (limit) query.limit(limit);
  if (limit === 1) return query.first();
  return query;
};

module.exports = {
  getCategory,
};
