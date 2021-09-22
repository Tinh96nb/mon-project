const repoUser = require('../repository');

async function listCategories(req, res) {
  const categories = await repoUser.getList();
  res.render('pages/categories', { categories });
}
async function listCategoriesJson(req, res) {
  const categories = await repoUser.getList();
  res.status(200).json({ categories });
}

async function createItem(req, res) {
  const { body } = req;
  const rest = await repoUser.create({
    name: body.name
  });
  if (rest.success) res.status(200).json(rest);
  res.status(400).json(rest);
}

async function deleteItem(req, res) {
  const { id } = req.body;

  const rest = await repoUser.deleteItem(id);
  if (rest.success) res.status(200).json(rest);
  res.status(400).json(rest);
}

async function editItem(req, res) {
  const { body } = req;
  const rest = await repoUser.edit({
    id: body.id,
    name: body.name
  });
  if (rest.success) res.status(200).json(rest);
  res.status(400).json(rest);
}

module.exports = {
  listCategories,
  listCategoriesJson,
  createItem,
  deleteItem,
  editItem,
};
