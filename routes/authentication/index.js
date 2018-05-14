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
let db = require('../../db/index.js');

// router.get('/ping', function(req, res, next) {
//   res.json({Found: 'Test'});
// });

router.get('/admin/panel', requiresAdmin, admin.renderPanel);

router.post(
    '/admin/login',
    passport.authenticate('local', {failureRedirect: '/admin/login'}),
    admin.login,
);

router.post('/login', passport.authenticate('local'), users.login);
router.get('/logout', users.logout);
router.get('/ping', requiresLogin, users.ping);

router.get('/admin/login', admin.renderLogin);
router.post(
    '/admin/login',
    passport.authenticate('local', {failureRedirect: '/admin/login'}),
    admin.login,
);
router.get('/admin/panel', requiresAdmin, admin.renderPanel);

router.get('/health', monitoring.health(db));

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
