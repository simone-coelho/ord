const jsonUtils = require('../helpers/json-utils');
const jsonToCSV = require('../helpers/json-csv').jsonToCSV;
const winston = require('../config/winston');
const config = require('../config/config');
const Promise = require('bluebird');


async function transformObjToCSV () {
    let csvData;

    csvData = await jsonToCSV(paramsObj);
    console.log(csvData);
    winston.log('debug', 'Campaigns object transformation to CSV completed: ' +
        config.loggerDate());
    return csvData;
}

module.exports.transformObjToCSV = transformObjToCSV;


let unwindFields = [];

let fields = [];

let campaignJsonObj = [];

let paramsObj = {
    unwindData: unwindFields,
    fieldsData: fields,
    jsonSchema: campaignJsonObj,
    flatten: true,
    fileName: 'campaigns'
};