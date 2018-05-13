const pg = require('pg');
let winston = require('../config/winston');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
let config = {
    user: 'postgres', //env var: PGUSER
    database: 'optly_db', //env var: PGDATABASE
    password: 'postgres', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

// this initializes a connection pool
// it will keep idle connections open for 30 seconds
// and set a limit of maximum 10 idle clients
const pool = new pg.Pool(config);

pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between our application and the database, the database restarts, etc.
    // and so we  want to handle it and at log it out
    //console.error('idle client error', err.message, err.stack);
    winston.log('error', 'idle client error: ' + err.message + ' - ' +
        err.stack);
});

pool.on('connect', function (client) {
    winston.log('debug', 'pg client connected: ' + new Date());
});

pool.on('acquire', function (client, callback) {
    winston.log('debug', 'pg client acquired: ' + new Date());
});

pool.on('remove', function (client) {
    winston.log('debug', 'pg client removed: ' + new Date());
});

// export the query method for passing queries to the pool
function query (text, values, callback) {
    winston.log('info', 'query: ' + text + ' - ' + values);
    return pool.query(text, values, callback);
}

module.exports.query = query;

// the pool also supports checking out a client for
// multiple operations, such as a transaction
module.exports.connect = function (callback) {
    return pool.connect(callback);
};

