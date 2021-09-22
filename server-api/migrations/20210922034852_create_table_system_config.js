exports.up = async function (knex) {
  await knex.schema.dropTableIfExists("system_config");
  await knex.schema.createTable("system_config", function (table) {
    table.increments("id");
    table.string("name").notNullable();
    table.string("value");
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("system_config");
};
