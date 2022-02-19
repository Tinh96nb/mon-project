exports.up = function(knex) {
  return knex.schema.table('nfts', function (table) {
    table.string('thumbnail')
  })
};

exports.down = function(knex) {
  return knex.schema.table('nfts', function (table) {
    table.dropColumn('thumbnail')
  })
};
