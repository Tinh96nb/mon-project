const knex = require('../../db');
const bcrypt = require('bcrypt');

async function getUser(id) {
  const [user] = await knex('admins')
    .where('id', id)
    .select('email', 'username');
  return user;
}

async function updateUserInfo({ username, email, id }) {
  await knex('admins')
    .where({ id })
    .update({
      username,
      email,
      updated_at: knex.fn.now(),
    })
  const user = await knex('admins')
    .where('id', id)
    .select('email', 'username').first();
  return user;
}

async function changePassword({ current, newpass, id }) {
  const user = await knex('admins').where({ id }).first();
  if (!user) return {
    success: false,
    message: 'Not found user!'
  };
  const isPasswordValid = await bcrypt.compare(current, user.password);
  if (!isPasswordValid) {
    return {
      success: false,
      message: 'Password current is not match!'
    };
  }
  const hashedPass = await bcrypt.hash(newpass, 5);
  await knex('admins').where({ id }).update({password: hashedPass})
  return {
    success: true,
    message: 'Change password success!'
  };
}

module.exports = {
  getUser,
  updateUserInfo,
  changePassword
};
