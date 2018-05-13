const jsonUtils = require('../helpers/json-utils');
const jsonToCSV = require('../helpers/json-csv').jsonToCSV;
const winston = require('../config/winston');
const config = require('../config/config');
const Promise = require('bluebird');

async function transformObjToCSV () {
    let csvData;

    csvData = await jsonToCSV(paramsObj);
    console.log(csvData);
    winston.log('debug', 'Pages object transformation to CSV completed: ' +
        config.loggerDate());
    return csvData;
}

module.exports.transformObjToCSV = transformObjToCSV;

let unwindFields = [];

let fields = [
    'edit_url',
    'name',
    'project_id',
    'activation_code',
    'activation_type',
    'archived',
    'category',
    'conditions',
    'key',
    'page_type',
    'created',
    'id',
    'last_modified'];

let pagesJsonObj = [
    {
        edit_url: 'https://www.optimizely.com',
        name: 'Home Page',
        project_id: 1000,
        activation_code: 'function callbackFn(activate, options) { activate(); }',
        activation_type: 'callback',
        archived: false,
        category: 'article',
        conditions: '["and", {"type": "url", "match_type": "substring", "value": "optimize"}]',
        key: 'home_page',
        page_type: 'single_url',
        created: '2018-05-10T04:58:42.839Z',
        id: 4000,
        last_modified: '2018-05-10T04:58:42.839Z'
    }];

let paramsObj = {
    unwindData: unwindFields,
    fieldsData: fields,
    jsonSchema: pagesJsonObj,
    flatten: true,
    fileName: 'pages'
};