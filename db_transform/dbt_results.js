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

let resultsJsonObj = [{
    confidence_threshold: 0.9,
    end_time: '2018-05-10T04:58:42.775Z',
    experiment_id: 3000,
    metrics: [
        {
            aggregator: 'unique',
            event_id: 0,
            field: 'revenue',
            name: 'string',
            results: {
                '9000': {
                    experiment_id: 0,
                    is_baseline: true,
                    level: 'variation',
                    lift: {
                        confidence_interval: [
                            0.010399560300730457,
                            0.0850821459929161
                        ],
                        confidence_interval_scaled: [
                            0
                        ],
                        end_of_epoch: true,
                        is_most_conclusive: true,
                        is_significant: true,
                        lift_status: 'equal',
                        significance: 0,
                        value: 0,
                        value_scaled: 0,
                        visitors_remaining: 0
                    },
                    name: 'Blue Button',
                    rate: 0,
                    samples: 0,
                    total_increase: {
                        confidence_interval: [
                            0.010399560300730457,
                            0.0850821459929161
                        ],
                        confidence_interval_scaled: [
                            0
                        ],
                        end_of_epoch: true,
                        is_most_conclusive: true,
                        is_significant: true,
                        lift_status: 'equal',
                        significance: 0,
                        value: 0,
                        value_scaled: 0,
                        visitors_remaining: 0
                    },
                    value: 0,
                    variance: 0,
                    variation_id: 'string'
                }
            },
            scope: 'session',
            winning_direction: 'increasing'
        }
    ],
    reach: {
        baseline_count: 0,
        baseline_reach: 0,
        total_count: 0,
        treatment_count: 0,
        treatment_reach: 0,
        variations: {
            '9000': {
                count: 0,
                name: 'Blue Button',
                variation_id: 'string',
                variation_reach: 0
            }
        }
    },
    start_time: '2018-05-10T04:58:42.777Z',
    stats_config: {
        confidence_level: 0,
        difference_type: 'absolute',
        epoch_enabled: true
    }
}];

let paramsObj = {
    unwindData: unwindFields,
    fieldsData: fields,
    jsonSchema: resultsJsonObj,
    flatten: true,
    fileName: 'results'
};

