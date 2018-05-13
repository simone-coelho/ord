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
    'project_id',
    'archived',
    'conditions',
    'description',
    'is_classic',
    'name',
    'segmentation',
    'created',
    'id',
    'last_modified'];

let audiencesJsonObj = [
    {
        project_id: 1000,
        archived: false,
        conditions: '["and", {"type": "language", "value": "es"}, {"type": "location", "value": "US-CA-SANFRANCISCO"}]',
        description: 'People that speak spanish and are in San Francisco',
        is_classic: true,
        name: 'Spanish speaking San Franciscans',
        segmentation: false,
        created: '2018-05-09T07:48:44.444Z',
        id: 5000,
        last_modified: '2018-05-09T07:48:44.444Z'
    }];

let paramsObj = {
    unwindData: unwindFields,
    fieldsData: fields,
    jsonSchema: audiencesJsonObj,
    flatten: true,
    fileName: 'audiences'
};