const bcrypt = require('bcrypt');
const knex = require('../../db');

const STATUS_BAN = 0;

async function getUserForLoginData(username, password) {
  const [user] = await knex('admins')
    .select()
    .where({ username })
    .limit(1);
  if (!user) {
    return null;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }
  if (user && user.status == STATUS_BAN) return null;
  await knex('admins').where({ username }).update({last_login_time: knex.fn.now()})
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

async function getUser(query) {
  const [user] = await knex('admins')
    .select(['id', 'username', 'email', 'last_login_time', 'status'])
    .where(query)
    .limit(1);
  if (user && user.status == STATUS_BAN) return null;
  return user;
}

async function getUserById(id) {
  return getUser({ id });
}

module.exports = {
  getUserForLoginData,
  getUserById,
};
