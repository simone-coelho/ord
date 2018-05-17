let express = require('express');
let winston = require('./config/winston.js');
let config = require('./config/config.js');
let pgdb = require('./db/index.js');

// Express initialization
let app = module.exports = express();
require('./express_server/index');

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

// CSV Transformation
// projectsTransform.transformObjToCSV();
// campaignsTransform.transformObjToCSV();
// experimentsTransform.transformObjToCSV();
// pagesTransform.transformObjToCSV();
// audiencesTransform.transformObjToCSV();
// attributesTransform.transformObjToCSV();
// pagesTransform.transformObjToCSV();
// eventsTransform.transformObjToCSV();
// resultsTransform.transformObjToCSV();
// planTransform.transformObjToCSV();

// Generate password for development...
// const bcrypt = require('bcrypt');
// const pass = 'testing';
// const saltRounds = 10; //the higher the better
// const hashedPassword = bcrypt.hashSync(pass, saltRounds);
// console.log(hashedPassword);

// async/await - check out a client
(async () => {
  const client = await pgdb.connect();
  try {
    const res = await client.query(
        'SELECT * FROM tbl_experiments WHERE campaign_id = $1', [1234]);

    winston.log('debug', 'query result returned: ' + res.rowCount + ' row(s)' +
        ' - ' + config.loggerDate());
    winston.log('debug', 'query result data: ' + JSON.stringify(res.rows[0]) +
        ' - ' + config.loggerDate());
  } finally {
    client.release();
  }
})().
    catch(e => winston.log('error', 'Database - ' + e.stack + ' - ' +
        config.loggerDate()));

module.exports = app;

