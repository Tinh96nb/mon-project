const knex = require('../../db');

async function listInit() {
  const nfts = await knex('nfts').select('token_id').where({ status: 2});
  const users = await knex('users').select('id', 'address').where({status: 1});
  return {
    nfts,
    users
  };
}

async function listConfig() {
  return knex('system_config')
}
async function updateConfig(dataForm) {
  Object.keys(dataForm).map(async (field) => {
    await knex('system_config')
      .where({ name: field })
      .update({value: dataForm[field]})
  })
}

module.exports = {
  listInit,
  updateConfig,
  listConfig
};
