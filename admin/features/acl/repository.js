const knex = require('../../db');
const bcrypt = require('bcrypt');

async function listRoles() {
  const roles = await knex('acl_meta')
    .where('acl_key', 'roles')
    .first();
  return JSON.parse(roles.acl_value);
}

async function listMember() {
  const members = await knex('admins').select(['id', 'status', 'username', 'email', 'last_login_time']);
  return members;
}

async function deleteMember(id) {
  try {
    await knex('admins').where({id}).del();
    return {
      success: true,
      message: 'Done'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Fail'
    }
  }
}

async function toggetStatus(userId, status) {
  const user = await knex('admins').where('id', userId).first();
  if (user) {
    const result = await knex('admins').where('id', userId).update({status});
    return result;
  }
  return null;
}

async function createMem(data) {
  const hashedPass = await bcrypt.hash(data.password, 5);
  const [idUser] = await knex('admins').insert({username: data.username, email: data.email, password: hashedPass, status: 1});
  return idUser;
}
module.exports = {
  listRoles,
  listMember,
  deleteMember,
  createMem,
  toggetStatus
};
