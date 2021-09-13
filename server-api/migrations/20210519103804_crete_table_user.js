exports.up = async function (knex) {
    await knex.schema.dropTableIfExists('users')
    await knex.schema.createTable('users', function (table) {
      table.increments('id')
      table.string('address').notNullable().unique()
      table.string('username').unique()
      table.string('email')
      table.integer('nonce')
      table.string('avatar')
      table.string('cover')
      table.text('bio')
      table.string('facebook')
      table.string('twitter')
      table.string('instagram')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }
  exports.down = function (knex) {
    return knex.schema.dropTable('users')
  }