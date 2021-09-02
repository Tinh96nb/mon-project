exports.up = async function (knex) {
  await knex.schema.dropTableIfExists('categories')
  await knex.schema.createTable('categories', function (table) {
    table.increments('id')
    table.string('name')
    table.string('image')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}
exports.down = function (knex) {
  return knex.schema.dropTable('categories')
}