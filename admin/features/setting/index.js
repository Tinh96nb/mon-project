const { listInit, listConfig, updateConfig } = require('./repository');

async function updateSetting(req, res) {
  const { nft = '', user } = req.body
  await updateConfig({nft, user: user ? user.toString() : ''});
  req.session.messages = { success: "Update success config!" };
  return res.redirect('/system-config');
}

async function updateFooter(req, res) {
  await updateConfig(req.body);
  req.session.messages = { successFooter: "Update success config!" };
  return res.redirect('/system-config');
}

async function renderPage(req, res) {
  const init = await listInit();
  const configs = await listConfig();
  let revert = {};
  configs.forEach((config) => {
    revert[config.name] = config
  })
  return res.render('pages/system', {init, revert})
}
module.exports = {
  renderPage,
  updateSetting,
  updateFooter
};
