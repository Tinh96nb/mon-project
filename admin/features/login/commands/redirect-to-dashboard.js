async function redirectToDashboard(req, res) {
  const { user } = req;
  req.session.userInfo = user;
  return res.redirect('/');
}

module.exports = redirectToDashboard;
