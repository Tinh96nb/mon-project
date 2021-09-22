const repoUser = require('../repository');

async function listUser(req, res) {
  const users = await repoUser.getList();
  res.status(200).json({data: users});
}

async function toggleUser (req, res) {
  const { id } = req.body;
  const rest = await repoUser.toggleUser(id);
  res.status(200).json(rest);
}

module.exports = {
  listUser,
  toggleUser
}