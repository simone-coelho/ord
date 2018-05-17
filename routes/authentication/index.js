const express = require('express');
const router = express.Router();
const {requiresLogin, requiresAdmin} = require(
    '../../express_server/authentication/authorization');
const config = require('../../config/config');
const winston = require('../../config/winston');
const users = require('../../express_server/users');
const admin = require('../../express_server/admin');
const monitoring = require('../../express_server/monitoring');
const passport = require('../../express_server/authentication/passport');
const pgdb = require('../../db/index.js');

router.get('/admin/panel', requiresAdmin, admin.renderPanel);

router.post('/login', passport.authenticate('local'), users.login);

router.get('/logout', users.logout);

router.get('/ping', requiresLogin, users.ping);

router.get('/admin/login', admin.renderLogin);

router.post(
    '/admin/login', passport.authenticate('local',
                                          {failureRedirect: '/api/v2/auth/admin/login'},
    ),
    admin.login,
);

function handleResponse(res, code, statusMsg) {
  res.status(code)
      .json({status: statusMsg});
}

// router.post('/admin/login', (req, res, next) => {
//   console.log(req.body);
//   passport.authenticate('local', (err, user, info) => {
//     if (err) { handleResponse(res, 500, 'error'); }
//     if (!user) { handleResponse(res, 404, 'User not found'); }
//     if (user) {
//       req.logIn(user, function (err) {
//         if (err) { handleResponse(res, 500, 'error'); }
//         handleResponse(res, 200, 'success');
//       });
//     }
//   })(req, res, next);
// });

router.get('/admin/panel', requiresAdmin, admin.renderPanel);

router.get('/health', monitoring.health(pgdb));

router.use(function(err, req, res, next) {
  if (err.message && (~err.message.indexOf('not found'))) {
    return next();
  }

  winston.error(err.stack);

  return res.status(500).json({error: 'Error on backend occurred.'});
});

router.use(function(req, res) {
  const payload = {
    url: req.originalUrl, error: 'Not found',
  };
  if (req.accepts('json')) return res.status(404).json(payload);

  res.status(404).render('404', payload);
});

module.exports = router;
