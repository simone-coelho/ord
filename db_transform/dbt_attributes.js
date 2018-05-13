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

let fields = [
    'key',
    'project_id',
    'archived',
    'description',
    'name',
    'condition_type',
    'id',
    'last_modified'];

let attributesJsonObj = [
    {
        key: 'subscriber_status',
        project_id: 0,
        archived: false,
        description: 'string',
        name: 'Subscriber Status',
        condition_type: 'custom_attribute',
        id: 0,
        last_modified: '2018-05-10T04:58:42.909Z'
    }];

let paramsObj = {
    unwindData: unwindFields,
    fieldsData: fields,
    jsonSchema: attributesJsonObj,
    flatten: true,
    fileName: 'attributes'
};