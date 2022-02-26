
exports.up = function(knex) {
  return knex.schema.table('nfts', (table) => {
    table.tinyint('updated').defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.table('nfts', (table) => {
    table.dropColumn('updated');
  });
};
