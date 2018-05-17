const jsonUtils = require('../helpers/json-utils');
const jsonToCSV = require('../helpers/json-csv').jsonToCSV;
const winston = require('../config/winston');
const config = require('../config/config');
const Promise = require('bluebird');

async function transformObjToCSV(jsonObj, writeFiles, flatten) {

  jsonObj = (typeof jsonObj === 'undefined') ? projectJsonObj : jsonObj;
  paramsObj.flatten = flatten;

  paramsObj.jsonSchema = jsonObj;

  let csvData = await jsonToCSV(paramsObj, writeFiles);
  //console.log(csvData);
  winston.log('debug', 'Projects object transformation to CSV completed: ' +
      config.loggerDate());
  return csvData;
}

module.exports.transformObjToCSV = transformObjToCSV;

let unwindFields = [];

let fields = [
  'account_id',
  'confidence_threshold',
  'created',
  'description',
  'id',
  'is_classic',
  'last_modified',
  'name',
  'platform',
  'sdks',
  'socket_token',
  'status',
  'web_snippet.code_revision',
  'web_snippet.enable_force_variation',
  'web_snippet.exclude_disabled_experiments',
  'web_snippet.exclude_names',
  'web_snippet.include_jquery',
  'web_snippet.ip_anonymization',
  'web_snippet.js_file_size',
  'web_snippet.library',
  'dcp_service_id',
  'web_snippet.ip_filter',
  'web_snippet.project_javascript',
];

let projectJsonObj = [
  {
    name: 'Test Project',
    confidence_threshold: 0.9,
    dcp_service_id: 121234,
    description: 'Project for user sign up flow',
    platform: 'web',
    sdks: [
      'android', 'iOS',
    ],
    status: 'active',
    web_snippet: {
      enable_force_variation: false,
      exclude_disabled_experiments: false,
      exclude_names: true,
      include_jquery: true,
      ip_anonymization: false,
      ip_filter: '^206\\.23\\.100\\.([5-9][0-9]|1([0-4][0-9]|50))$',
      library: 'jquery-1.11.3-trim',
      project_javascript: 'alert("Active Experiment")',
      code_revision: 0,
      js_file_size: 63495,
    },
    account_id: 12345,
    created: '2018-05-09T15:57:30.679Z',
    id: 1000,
    is_classic: true,
    last_modified: '2018-05-09T15:57:30.679Z',
    socket_token: 'AABBCCDD~123456789',
  },
];

let paramsObj = {
  unwindData: unwindFields,
  fieldsData: fields,
  jsonSchema: projectJsonObj,
  flatten: true,
  fileName: 'projects',
};