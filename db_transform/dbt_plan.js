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

let unwindFields = ['product_usages', 'product_usages.projects'];

let fields = [
    'account_id',
    'plan_name',
    'product_usages.allocation_term_in_months',
    'product_usages.end_time',
    'product_usages.last_update_time',
    'product_usages.overage_cents_per_visitor',
    'product_usages.product_name',
    'product_usages.projects.project_id',
    'product_usages.projects.project_name',
    'product_usages.projects.project_usage',
    'product_usages.start_time',
    'product_usages.usage',
    'product_usages.usage_allowance',
    'status',
    'unit_of_measurement'];

let planJsonObj = [
    {
        account_id: 1234567,
        plan_name: 'Enterprise - Premium Optimizely X Web',
        product_usages: [
            {
                allocation_term_in_months: 6,
                end_time: '2018-05-10T06:55:01.636Z',
                last_update_time: '2018-05-10T06:55:01.636Z',
                overage_cents_per_visitor: 0.001,
                product_name: 'Optimizely X AB Testing',
                projects: [
                    {
                        project_id: 1234567,
                        project_name: 'Experimentation of the home page',
                        project_usage: 12345
                    }, {
                        project_id: 1234567990,
                        project_name: 'Experimentation of the home page 2',
                        project_usage: 12345098
                    }],
                start_time: '2018-05-10T06:55:01.637Z',
                usage: 12345,
                usage_allowance: 123456
            }],
        status: 'trial',
        unit_of_measurement: 'Monthly Unique Visitors'
    }];

let paramsObj = {
    unwindData: unwindFields,
    fieldsData: fields,
    jsonSchema: planJsonObj,
    flatten: true,
    fileName: 'plan'
};