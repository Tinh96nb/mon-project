const { changePassword } = require('../repository');

async function updateUser(req, res) {
  const { user: { id } } = req;
  const result = await changePassword({ ...req.body, id });
  if (result.success) {
    req.session.messages = { successPassword: result.message };
    return res.redirect('/profile');
  }
  req.session.messages = { errors: { current: result.message } };
  return res.redirect('/profile');
}

module.exports = updateUser;
