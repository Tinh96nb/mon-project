const bcrypt = require('bcrypt');

exports.seed = async function seed(knex) {
  const hashedPass = await bcrypt.hash('123123', 5);
  await knex('admins').insert([
    {
      username: 'admin',
      email: 'admin@mon.com',
      password: hashedPass,
      created_at: new Date(),
      updated_at: new Date(),
    }
  ]);
};
