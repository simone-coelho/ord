const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const winston = require('../config/winston');
const config = require('../config/config');
const routes = require('../routes');
const pgSession = require('connect-pg-simple')(session);
let db = require('../db/index.js');
const passport = require('./../express_server/authentication/passport');

// var compression = require('compression')
// var express = require('express')
// var app = express()
// app.use(compression())
module.exports = (app) => {
//let app = express();

  app.use('/', routes);

// port setup
  const port = process.env.PORT || 9000;

  const server = app.listen(port, () => {
    if (app.get('env') === 'test') return;
    winston.log('debug', 'Express app started on port: ' + port + ' - ' +
        config.loggerDate());
  });

  server.on('close', () => {
    winston.log('debug', 'Express server shut down: ' + config.loggerDate());
  });

// view engine setup
  const viewsPath = path.join(__dirname, 'views');
  app.set('views', viewsPath);
  app.engine('.hbs', exphbs({
                              extname: '.hbs',
                              defaultLayout: 'main',
                              layoutsDir: viewsPath + '/layouts',
                            }));

  app.set('view engine', '.hbs');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(expressValidator());

  app.use(methodOverride(function(req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  app.use(cookieParser());
  app.use(session({
                    store: new pgSession({pool: db.pool}),
                    secret: config.auth.sessionSecret,
                    resave: false,
                    saveUninitialized: true,
                    cookie: {maxAge: 14 * 24 * 60 * 60 * 1000},
                  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(morgan('combined', {stream: winston.stream}));
  //app.use(express.json());
  //app.use(express.urlencoded({extended: true}));
  app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

// error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // add this line to include winston logging
    winston.error(`${err.status ||
    500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
};
