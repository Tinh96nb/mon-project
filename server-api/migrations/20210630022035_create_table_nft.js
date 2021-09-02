exports.up = async function (knex) {
    await knex.schema.dropTableIfExists('nfts')
    await knex.schema.createTable('nfts', function (table) {
      table.increments('id')
      table.integer('token_id').notNullable().unique()
      table.string('owner')
      table.string('author')
      table.integer('status').comment("0.creator, 1.verify, 2.selling, 3.report")
      table.string('name').notNullable()
      table.string('description')
      table.string('media').notNullable()
      table.string('mine_type').notNullable()
      table.string('price')
      table.float('feeCopyright').defaultTo(0);
      table.string('unit').defaultTo("MON")
      table.integer('category_id').unsigned()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
      table.foreign('owner').references('users.address')
      table.foreign('author').references('users.address')
    })
  }
  exports.down = function (knex) {
    return knex.schema.dropTable('nfts')
  }