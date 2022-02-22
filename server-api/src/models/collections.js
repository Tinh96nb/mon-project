const { statusNft } = require('../helper/const');
const knex = require('./connect');

const getCollections = async (condition, limit = 1) => {
  let query = knex('collections').select("collections.*").where(condition);
  if (limit) query.limit(limit);
  if (limit === 1) {
    const withUser = function (queryBuilder, foreignKey) {
      queryBuilder.leftJoin('users', foreignKey, 'users.id').select([
        'users.id as userId',
        'users.username',
        'users.address as userAddress',
        'users.email',
      ]);
    };
    const collection = await query.modify(withUser, 'user_id').first();
    const nft = await knex('nfts').select(
      knex.raw(`
        count(*) as totalItems,
        count(distinct(nfts.owner)) as totalOwners
      `),
    )
      .andWhere({
        collection_id: collection.id,
      })
      .andWhere('status', 'in', [
        statusNft.verified,
        statusNft.selling,
      ])
      .first();
    const withHistory = function (queryBuilder, foreignKey) {
      queryBuilder
        .leftJoin('nft_histories', foreignKey, 'nft_histories.token_id')
        .where('nft_histories.price', 'is not', null)
    };
    const queryHistory = knex('nfts')
      .where('collection_id', collection.id)
      .modify(withHistory, 'nfts.token_id');
    const nftHistory = await queryHistory.clone().select(
      knex
        .raw(`
          MIN(nft_histories.price) as floorPrice,
          SUM(nft_histories.price) as volumeTraded
        `))
        .first();

    collection.totalItems = nft.totalItems || 0;
    collection.totalOwners = nft.totalOwners || 0;
    collection.floorPrice = nftHistory.floorPrice || 0;
    collection.volumeTraded = nftHistory.volumeTraded || 0;

    return collection;
  };

  query = query
    .leftJoin('nfts', function() {
      this.on('nfts.collection_id', '=', 'collections.id')
        .andOn(knex.raw('nfts.status in (?,?)', [statusNft.verified, statusNft.selling]))
    })
    .select(knex.raw(`count(nfts.id) as totalItems`))
    .groupBy('collections.id')
    .orderBy("id", "desc");
  const collections = await query;
  return collections;
};

const create = async (data) => {
  try {
    const collection = await knex('collections').insert(data);
    return collection;
  } catch (error) {
    console.log(error);
  }
  return null;
};

const update = async (id, userId, data) => {
  try {
    const collection = await knex('collections').where({ id, user_id: userId }).update(data);
    return collection;
  } catch (error) {
    console.log(error);
  }
  return null;
};

const getConfig = async () => {
  return knex('system_config').whereNotIn('name', ['nft', 'user']);
};

module.exports = {
  getCollections,
  getConfig,
  create,
  update,
};
