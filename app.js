let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let appRoot = require('app-root-path');
let morgan = require('morgan');
//let winston = require('winston');
let winston = require('./config/winston.js');
let config = require('./config/config.js');
const httpUtils = require('./helpers/http-utils');
let jsonCSV = require('./helpers/json-csv');
let pool = require('./db/index.js');

// CSV Transform
let projectsTransform = require('./db_transform/dbt_projects');
let campaignsTransform = require('./db_transform/dbt_campaigns');
let experimentsTransform = require('./db_transform/dbt_experiments');
let pagesTransform = require('./db_transform/dbt_pages');
let audiencesTransform = require('./db_transform/dbt_audiences');
let attributesTransform = require('./db_transform/dbt_attributes');
let resultsTransform = require('./db_transform/dbt_results');
let eventsTransform = require('./db_transform/dbt_events');
let planTransform = require('./db_transform/dbt_plan');

//Set to production on deploy
let isProduction = process.env.NODE_ENV === 'production';

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('combined', {stream: winston.stream}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*** Start - Router & Routes ***/

// Routers
let projectsRouter = require('./routes/projects');
let experimentsRouter = require('./routes/experiments');
let updateAttributesRouter = require('./routes/update_attributes');

// Routes
app.use('/projects', projectsRouter);
app.use('/experiments', experimentsRouter);
app.use('/update_attributes', updateAttributesRouter);

/*** End - Router & Routes ***/

//app.use(session({ secret: 'mustchangetodeploy', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

// Add log file path...
// winston.add(winston.transports.File, { filename: './logs/logfile.log' });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
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

// CSV Transformation
projectsTransform.transformObjToCSV();
campaignsTransform.transformObjToCSV();
experimentsTransform.transformObjToCSV();
pagesTransform.transformObjToCSV();
audiencesTransform.transformObjToCSV();
attributesTransform.transformObjToCSV();
pagesTransform.transformObjToCSV();
eventsTransform.transformObjToCSV();
//resultsTransform.transformObjToCSV();
planTransform.transformObjToCSV();

// async/await - check out a client
(async () => {
    const client = await pool.connect();
    try {
        const res = await client.query(
            'SELECT * FROM tbl_experiments WHERE campaign_id = $1', [1234]);

        winston.log('debug', 'query result returned: ' + res.rowCount +
            ' row(s)' + ' - ' + config.loggerDate());
        winston.log('debug', 'query result data: ' +
            JSON.stringify(res.rows[0]) + ' - ' + config.loggerDate());
    } finally {
        client.release();
    }
})().
    catch(e => winston.log('error', 'Database - ' + e.stack + ' - ' +
        config.loggerDate()));

module.exports = app;
