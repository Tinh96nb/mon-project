const knexFactory = require('knex')
const {db: defaultDbConfig} = require('../config')
const knex = knexFactory(defaultDbConfig);

module.exports = knex;