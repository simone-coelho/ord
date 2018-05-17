module.exports = {
  renderLogin: (req, res) => {
    res.render('login');
  },

  login: (req, res) => {
    if (req.user.type === 'admin') {
      res.redirect('/api/v2/auth/admin/panel');
    } else {
      res.redirect('/api/v2/auth/admin/login');
    }
  },

  renderPanel: (req, res) => {
    res.render('admin-panel');
  },
};
