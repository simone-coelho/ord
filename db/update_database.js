const winston = require('../config/winston');
const Promise = require('bluebird');
const config = require('../config/config.js');
const placeHolder = require('string-placeholder');
const pgdb = require('../db/index.js');
const csv = require('async-csv');

async function copyToDatabase(csvData, tableName) {
  try {

    let parsedCSV = await csv.parse(csvData, {delimiter: ','});
    winston.log('Debug', 'Parsing CSV data for insert query done: ' +
        tableName + ' - ' + config.loggerDate());

    (async () => {
      // note: we don't try/catch this because if connecting throws an exception
      // we don't need to dispose of the client (it will be undefined)
      const client = await pgdb.connect();

      const params = [];
      for (let i = 1; i <= parsedCSV[0].length; i++) {
        parsedCSV[0][i - 1] = ('"' + parsedCSV[0][i - 1] + '"');
        params.push('$' + i);
      }

      let columns = parsedCSV[0].join(',');
      const sqlTemplate = placeHolder(
          'INSERT INTO ${table}(${columns}) VALUES (${values})', {
            table: tableName,
            columns: columns,
          });

      let rowCount = 0;
      try {

        await client.query('BEGIN');
        await client.query('DELETE FROM ' + tableName);

        for (let i = 1, len = parsedCSV.length; i < len; i++) {

          let insertSQL = placeHolder(sqlTemplate, {values: params.join(',')});

          winston.log('debug', 'Database update from CSV SQL text: ' +
              tableName + ' - ' + insertSQL + ' - ' + config.loggerDate());

          await client.query(insertSQL, parsedCSV[i]);
          rowCount++;
        }
        await client.query('COMMIT');

        winston.log('debug', 'Database update from CSV completed for: ' +
            tableName + ' - Total records updated: ' + rowCount + ' - ' +
            config.loggerDate());
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    })()
        .catch(
            e => winston.log('error', 'Database update from CSV: ' + tableName +
                ' - ' + e.stack + ' - ' + config.loggerDate()));

    return parsedCSV;

  } catch (error) {
    winston.log('Error', 'While parsing CSV data for insert query: ' +
        tableName + ' - ' + error + ' - ' + config.loggerDate());
  }
}

module.exports.copyToDatabase = copyToDatabase;