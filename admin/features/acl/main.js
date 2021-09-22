const repoACL = require('./repository');
const knex = require('../../db');
const nodeACL = require('acl');
const AclKnexBackend = require('acl-knex-mysql');

const acl_knex = new AclKnexBackend(knex, 'acl_');
const acl = new nodeACL(acl_knex);

async function managerRole(req, res) {
  const { role, type } = req.body
  try {
    if (type == 0) {
      await acl.removeRole(role);
    }
    if (type == 1) {
      await acl.allow(role, '/', 'get');
    }
    res.status(200).json({message: 'Done!'})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Error!'})
  }
}

async function managerResource(req, res) {
  const { role, resource, type } = req.body
  const [method, path] = resource.split(' - ')
  try {
    if (type == 0) {
      await acl.removeAllow(role, path.trim(), method.trim().toLowerCase());
    }
    if (type == 1) {
      await acl.allow(role, path.trim(), method.trim().toLowerCase());
    }
    res.status(200).json({message: 'Done!'})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Error!'})
  }
}

async function renderPage(req, res) {
  const roles = await repoACL.listRoles();
  res.render('pages/acl', { roles })
}

async function getResource(req, res) {
  const roles = await repoACL.listRoles();
  const result = await Promise.all(roles.map(async (role) => {
    const resource = await acl.whatResources(role);
    return {[role]: resource};
  }));
  const { routers } = res.locals
  res.status(200).json({
    roles: result,
    routers
  })
}

module.exports = {
  renderPage,
  managerResource,
  managerRole,
  getResource,
  acl
}