
exports.up = async function(knex) {
  await knex.schema.createTable('collections', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable().unique();
    table.string('slug', 50).notNullable().unique();
    table.string('description').notNullable();
    table.string('img_avatar_url').notNullable();
    table.string('img_cover_url').notNullable();
    table.integer('user_id', 10).notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  });
  return knex.schema.table('nfts', (table) => {
    table.integer('collection_id').unsigned().references('id').inTable('collections').onDelete('CASCADE');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('nfts', (table) => {
    table.dropForeign('collection_id');
    table.dropColumn('collection_id');
  });
  return knex.schema.dropTable('collections');
};
