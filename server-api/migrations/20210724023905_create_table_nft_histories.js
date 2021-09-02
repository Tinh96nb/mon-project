exports.up = async function (knex) {
  await knex.schema.dropTableIfExists("nft_histories");
  await knex.schema.createTable("nft_histories", function (table) {
    table.increments("id");
    table.integer("token_id").notNullable();
    table.string("from");
    table.string("to");
    table.float("price")
    table.integer("type").notNullable().comment("0.init, 1.transfer");
    table.string("txid").notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("nft_histories");
};
