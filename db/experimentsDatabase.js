const express = require('express');
const router = express.Router();
const jsonUtils = require('../helpers/json-utils');
const httpUtils = require('../helpers/http-utils');
const config = require('../config/config.js');
const winston = require('../config/winston');
const Promise = require('bluebird');
const rp = require('request-promise-native');
const projects = require('../routes/projects');
const delay = require('delay');
const jsonCSVTransform = require('../helpers/json-csv');
const pool = require('../db/index.js');
const sql = require('sql');
const fs = require('fs');
const pg = require('pg');
const copyFrom = require('pg-copy-streams').from;

pg.connect(function(err, client, done) {
    let stream = client.query(copyFrom('COPY my_table FROM STDIN'));
    let fileStream = fs.createReadStream('some_file.tsv')
    fileStream.on('error', done);
    fileStream.pipe(stream).on('finish', done).on('error', done);
});

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