
exports.up = function(knex) {
  return knex.schema.table('collections', (table) => {
    table.tinyint('status').defaultTo(1);
    table.string('slug', 500).alter();
  });
};

exports.down = function(knex) {
  return knex.schema.table('collections', (table) => {
    table.dropColumn('status');
  });
};
