const {cleanSlug} = require('../src/helper/router');

exports.seed = async function (knex) {
  const users = await knex('users').select(['id', 'address']);
  for (let index = 0; index < users.length; index += 1) {
    const user = users[index];
    for (let i = 0; i < 4; i += 1) {
      await knex('collections').insert([
        {
          name: `Collection ${i} of ${user.id}`,
          description: `Description ${i}`,
          img_avatar_url: 'https://picsum.photos/200/300',
          img_cover_url: 'https://picsum.photos/1000/200',
          slug: cleanSlug(`Collection ${i} of ${user.id}`),
          user_id: user.id,
        },
      ]);
    }
    const collections = await knex('collections').where('user_id', user.id);
    const nfts = await knex('nfts').where('owner', user.address);
    const results = [];
    nfts.forEach(async (nft) => {
      results.push(knex('nfts').where('id', nft.id).update({
        collection_id: collections[Math.floor(Math.random() * collections.length)].id,
      }));
    });
    await Promise.all(results);
  }
};
