const jsonUtils = require('../helpers/json-utils');
const jsonToCSV = require('../helpers/json-csv').jsonToCSV;
const winston = require('../config/winston');
const config = require('../config/config');
const Promise = require('bluebird');

async function transformObjToCSV () {
    let csvData;

    csvData = await jsonToCSV(paramsObj);
    console.log(csvData);
    winston.log(
        'debug', 'Experiments object transformation to CSV completed: ' +
        +config.loggerDate());
    return csvData;
}

module.exports.transformObjToCSV = transformObjToCSV;

let unwindFields = [
    'changes',
    'metrics',
    'variations',
    'variations.actions',
    'variations.actions.changes'];

let fields = [
    'project_id',
    'type',
    'audience_conditions',
    'campaign_id',
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
    'description',
    'holdback',
    'key',
    'metrics.aggregator',
    'metrics.event_id',
    'metrics.field',
    'metrics.scope',
    'metrics.winning_direction',
    'multivariate_traffic_policy',
    'name',
    'page_ids',
    'schedule.start_time',
    'schedule.stop_time',
    'schedule.time_zone',
    'url_targeting.conditions',
    'url_targeting.edit_url',
    'url_targeting.activation_code',
    'url_targeting.activation_type',
    'url_targeting.key',
    'url_targeting.page_id',
    'variations.weight',
    'variations.actions.changes.type',
    'variations.actions.changes.allow_additional_redirect',
    'variations.actions.changes.async',
    'variations.actions.changes.attributes.class',
    'variations.actions.changes.attributes.hide',
    'variations.actions.changes.attributes.href',
    'variations.actions.changes.attributes.html',
    'variations.actions.changes.attributes.remove',
    'variations.actions.changes.attributes.src',
    'variations.actions.changes.attributes.style',
    'variations.actions.changes.attributes.text',
    'variations.actions.changes.config',
    'variations.actions.changes.css.background-color',
    'variations.actions.changes.css.background-image',
    'variations.actions.changes.css.border-color',
    'variations.actions.changes.css.border-style',
    'variations.actions.changes.css.border-width',
    'variations.actions.changes.css.color',
    'variations.actions.changes.css.font-size',
    'variations.actions.changes.css.font-weight',
    'variations.actions.changes.css.height',
    'variations.actions.changes.css.position',
    'variations.actions.changes.css.width',
    'variations.actions.changes.dependencies',
    'variations.actions.changes.destination',
    'variations.actions.changes.destination_function',
    'variations.actions.changes.name',
    'variations.actions.changes.operator',
    'variations.actions.changes.preserve_parameters',
    'variations.actions.changes.rearrange',
    'variations.actions.changes.selector',
    'variations.actions.changes.value',
    'variations.actions.changes.extension_id',
    'variations.actions.changes.id',
    'variations.actions.changes.src',
    'variations.actions.page_id',
    'variations.actions.share_link',
    'variations.archived',
    'variations.description',
    'variations.key',
    'variations.name',
    'variations.status',
    'variations.variation_id',
    'allocation_policy',
    'created',
    'earliest',
    'id',
    'is_classic',
    'last_modified',
    'latest',
    'status'];

/**
 * Literal JS object must be in an array for flattening
 * Used as schema for database table creation and mapping
 * @type {*[]}
 */
let expJsonObj = [
    {
        project_id: 1000,
        type: 'a/b',
        audience_conditions: '["and", {"audience_id": 7000}, {"audience_id":7001}]',
        campaign_id: 2000,
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
        description: 'string',
        holdback: 5000,
        key: 'home_page_experiment',
        metrics: [
            {
                aggregator: 'unique',
                event_id: 0,
                field: 'revenue',
                scope: 'session',
                winning_direction: 'increasing'
            }, {
                aggregator: 'total',
                event_id: 1,
                field: 'numeric',
                scope: 'session',
                winning_direction: 'decreasing'
            }],
        multivariate_traffic_policy: 'full_factorial',
        name: 'Blue Button Experiment',
        page_ids: [
            0],
        schedule: {
            start_time: 'string', stop_time: 'string', time_zone: 'GMT-01:00'
        },
        url_targeting: {
            conditions: '["and", {"type": "url", "match_type": "substring", "value": "optimize"}]',
            edit_url: 'https://www.optimizely.com',
            activation_code: 'function callbackFn(activate, options) { activate(); }',
            activation_type: 'callback',
            key: 'home_page',
            page_id: 6700
        },
        variations: [
            {
                weight: 0,
                actions: [
                    {
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
                            }], page_id: 0, share_link: 'string'
                    }],
                archived: true,
                description: 'string',
                key: 'blue_button_variation',
                name: 'Blue Button',
                status: 'string',
                variation_id: 0
            }],
        allocation_policy: 'string',
        created: '2018-05-07T17:21:17.046Z',
        earliest: '2018-05-07T17:21:17.046Z',
        id: 3000,
        is_classic: false,
        last_modified: '2018-05-07T17:21:17.046Z',
        latest: '2018-05-07T17:21:17.046Z',
        status: 'running'
    }];

let paramsObj = {
    unwindData: unwindFields,
    fieldsData: fields,
    jsonSchema: expJsonObj,
    flatten: true,
    fileName: 'experiments'
};

//module.exports.jsonToCSV = jsonToCSV;