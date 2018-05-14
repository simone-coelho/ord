const bcrypt = require('bcrypt');
const winston = require('winston');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy((username, password, callback) => {
  db.query(
      'SELECT id, username, password, type FROM tbl_users WHERE username=$1',
      [username], (err, result) => {
        if (err) {
          winston.error('Error when selecting user on login', err);
          return callback(err);
        }

        if (result.rows.length > 0) {
          const first = result.rows[0];
          bcrypt.compare(password, first.password, function(err, res) {
            if (res) {
              callback(null, {
                id: first.id,
                username: first.username,
                type: first.type,
              });
            } else {
              callback(null, false);
            }
          });
        } else {
          callback(null, false);
        }
      },
  );
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, callback) => {
  db.query('SELECT id, username, type FROM tbl_users WHERE id = $1',
           [parseInt(id, 10)], (err, results) => {
        if (err) {
          winston.error(
              'Error when selecting user on session deserialize', err);
          return callback(err);
        }

        callback(null, results.rows[0]);
      },
  );
});

module.exports = passport;
