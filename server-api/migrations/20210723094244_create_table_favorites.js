exports.up = async function (knex) {
  await knex.schema.dropTableIfExists("favorites");
  await knex.schema.createTable("favorites", function (table) {
    table.increments("id");
    table.string("user").notNullable();
    table.integer("to").notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['user', 'to']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("favorites");
};
