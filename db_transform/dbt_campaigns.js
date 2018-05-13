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

let unwindFields = [
    'changes', 'metrics'];

let fields = [
    'project_id',
    'changes.type',
    'changes.allow_additional_redirect',
    'changes.async',
    'changes.attributes.class',
    'changes.attributes.hide',
    'changes.attributes.href',
    'changes.attributes.html',
    'changes.attributes.remove',
    'changes.attributes.src',
    'changes.attributes.style',
    'changes.attributes.text',
    'changes.config',
    'changes.css.background-color',
    'changes.css.background-image',
    'changes.css.border-color',
    'changes.css.border-style',
    'changes.css.border-width',
    'changes.css.color',
    'changes.css.font-size',
    'changes.css.font-weight',
    'changes.css.height',
    'changes.css.position',
    'changes.css.width',
    'changes.dependencies',
    'changes.destination',
    'changes.destination_function',
    'changes.name',
    'changes.operator',
    'changes.preserve_parameters',
    'changes.rearrange',
    'changes.selector',
    'changes.value',
    'changes.extension_id',
    'changes.id',
    'changes.src',
    'experiment_priorities',
    'holdback',
    'metrics.aggregator',
    'metrics.event_id',
    'metrics.field',
    'metrics.scope',
    'metrics.winning_direction',
    'name',
    'page_ids',
    'url_targeting.conditions',
    'url_targeting.edit_url',
    'url_targeting.activation_code',
    'url_targeting.activation_type',
    'url_targeting.key',
    'url_targeting.page_id',
    'created',
    'earliest',
    'id',
    'last_modified',
    'latest',
    'status'];

let campaignJsonObj = [
    {
        project_id: 1000,
        changes: [
            {
                type: 'attribute',
                allow_additional_redirect: true,
                async: true,
                attributes: {
                    'class': 'intro',
                    hide: true,
                    href: 'example.com',
                    html: 'New Title',
                    remove: true,
                    src: 'song.mp3',
                    style: 'background-color:blue;',
                    text: 'Some nice message'
                },
                config: '{"name": "Flash Sale Today!", "color": "blue"}',
                css: {
                    'background-color': 'string',
                    'background-image': 'string',
                    'border-color': 'string',
                    'border-style': 'string',
                    'border-width': 'string',
                    color: 'string',
                    'font-size': 'string',
                    'font-weight': 'string',
                    height: 'string',
                    position: 'string',
                    width: 'string'
                },
                dependencies: [
                    24, 26],
                destination: 'https://app.optimizely.com/',
                destination_function: 'https://app.optimizely.com/',
                name: 'Setting button text',
                operator: 'after',
                preserve_parameters: true,
                rearrange: '{"insertSelector": ".greyBox", "operator": "before"}',
                selector: 'a[href*="optimizely"]',
                value: 'window.someGlobalFunction();',
                extension_id: 'string',
                id: 'string',
                src: 'string'
            }],
        experiment_priorities: [
            [
                0, 1, 2, 3]],
        holdback: 500,
        metrics: [
            {
                aggregator: 'unique',
                event_id: 0,
                field: 'revenue',
                scope: 'session',
                winning_direction: 'increasing'
            }],
        name: 'Landing Page Optimization',
        page_ids: [
            0, 1, 2],
        url_targeting: {
            conditions: '["and", {"type": "url", "match_type": "substring", "value": "optimize"}]',
            edit_url: 'https://www.optimizely.com',
            activation_code: 'function callbackFn(activate, options) { activate(); }',
            activation_type: 'callback',
            key: 'home_page',
            page_id: 6700
        },
        created: '2018-05-09T07:48:44.294Z',
        earliest: '2018-05-09T07:48:44.294Z',
        id: 2000,
        last_modified: '2018-05-09T07:48:44.294Z',
        latest: '2018-05-09T07:48:44.294Z',
        status: 'not_started'
    }];

let paramsObj = {
    unwindData: unwindFields,
    fieldsData: fields,
    jsonSchema: campaignJsonObj,
    flatten: true,
    fileName: 'campaigns'
};