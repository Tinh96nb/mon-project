const { listMember, listRoles, createMem, toggetStatus } = require('./repository');
const { acl } = require('./main');

async function renderPage(req, res) {
  const mem = await listMember();
  const roles = await listRoles();
  const members = await Promise.all(
    mem.map(async member => {
      const roles = await acl.userRoles(member.id);
      return {
        ...member,
        roles,
      };
    })
  );
  res.render('pages/member-role', { members, roles });
}

async function managerUserRole(req, res) {
  const { user_id, role, type } = req.body;
  try {
    if (type == 1) {
      await acl.addUserRoles(user_id, role);
    }
    if (type == 0) {
      await acl.removeUserRoles(user_id, role);
    }
    res.status(200).json({ message: 'Done!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error!' });
  }
}

async function createMember(req, res) {
  try {
    const memId = await createMem(req.body);
    if (memId) {
      if (req.body.role) {
        await acl.addUserRoles(memId, req.body.role);
      }
      req.session.messages = { success: 'Create user successfully!' };
      return res.redirect('/roles');
    }
  } catch (error) {
    let message = 'Error!';
    if (error.code === 'ER_DUP_ENTRY') {
      message = 'Username allready to use!';
    }
    req.session.messages = { errors: message };
    return res.redirect('/roles');
  }
}

async function toggeStatus(req, res) {
  const { user_id, type } = req.body;
  try {
    await toggetStatus(user_id, type);
    res.status(200).json({ message: 'Done!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error!' });
  }
}

module.exports = {
  renderPage,
  managerUserRole,
  createMember,
  toggeStatus,
};
