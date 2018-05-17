const pg = require('pg');
const winston = require('../config/winston');
const config = require('../config/config.js');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
const dbConfig = {
  user: process.env.DB_USER || 'postgres', //env var: DB_USER
  database: process.env.DB_NAME || 'optly_db', //env var: DB_NAME
  password: process.env.DB_PASSWORD || 'postgres', //env var: DB_PASSWORD
  host: process.env.DB_HOST || 'localhost', //env var: localhost
  port: process.env.DB_PORT || 5432, //env var: DB_PORT
  max: process.env.DB_MAX_CONNECTIONS || 10,  //env var: DB_MAX_CONNECTIONS
  idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT || 90000, //env var:
                                                           // DB_IDLE_TIMEOUT
};

// this initializes a connection pool
// it will keep idle connections open for 30 seconds
// and set a limit of maximum 10 idle clients
const pool = new pg.Pool(dbConfig);

pool.on('error', function(err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between our application and the database, the database restarts, etc.
  // and so we  want to handle it and at log it out
  //console.error('idle client error', err.message, err.stack);
  winston.log('error', 'idle client error: ' + err.message + ' - ' + err.stack);
});

pool.on('connect', function(client) {
  winston.log('debug', 'pg client connected: ' + config.loggerDate());
});

pool.on('acquire', function(client, callback) {
  winston.log('debug', 'pg client acquired: ' + config.loggerDate());
});

pool.on('remove', function(client) {
  winston.log('debug', 'pg client removed: ' + config.loggerDate());
});

// export the query method for passing queries to the pool
function query(text, values, callback) {
  winston.log('debug', 'query: ' + text + ' - ' + values);
  return pool.query(text, values, callback);
}

module.exports.query = query;
module.exports.pool = pool;

module.exports = {
  pool, query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};

// the pool also supports checking out a client for
// multiple operations, such as a transaction
module.exports.connect = function(callback) {
  return pool.connect(callback);
};

