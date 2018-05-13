const jsonUtils = require('../helpers/json-utils');
const jsonToCSV = require('../helpers/json-csv').jsonToCSV;
const winston = require('../config/winston');
const config = require('../config/config');
const Promise = require('bluebird');

/**
 * Transforms JS Object - CSV, Keys and Optionally flattens object
 * @returns {Promise<void|*>}
 */
async function transformObjToCSV () {
    let csvData;

    csvData = await jsonToCSV(paramsObj);
    console.log(csvData);
    winston.log('debug', 'Campaigns object transformation to CSV completed: ' +
        config.loggerDate());
    return csvData;
}

module.exports.transformObjToCSV = transformObjToCSV;

/**
 * Fields / Keys representing nested arrays that should be unwound (values retrieved)
 * @type {Array}
 */
let unwindFields = [];

/**
 * Array of columns that should be transformed into the CSV file
 * @type {string[]}
 */
let fields = [
    'archived',
    'category',
    'config.selector',
    'description',
    'event_type',
    'key',
    'name',
    'page_id',
    'project_id',
    'created',
    'id',
    'is_classic',
    'is_editable'];

/**
 * Sample Object (Schema) used to generate flat JSON keys for DB mapping
 * @type {*[]}
 */
let eventsJsonObj = [
    {
        archived: true,
        category: 'add_to_cart',
        config: {
            selector: '.menu-options'
        },
        description: 'Item added to cart',
        event_type: 'custom',
        key: 'add_to_cart',
        name: 'Add to Cart',
        page_id: 5000,
        project_id: 1000,
        created: '2018-05-10T04:58:42.856Z',
        id: 0,
        is_classic: false,
        is_editable: true
    }];

/**
 * Parameter options object for transformation operation
 * If "Flatten" = true, nested objects will be moved to
 * first level with dot notation - Ex. obj1.obj2.obj3
 * @type {{unwindData: Array, fieldsData: string[], jsonSchema: *[], flatten: boolean, fileName: string}}
 */
let paramsObj = {
    unwindData: unwindFields,
    fieldsData: fields,
    jsonSchema: eventsJsonObj,
    flatten: true,
    fileName: 'events'
};