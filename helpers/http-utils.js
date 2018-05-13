const express = require('express');
const jsonUtils = require('../helpers/json-utils');
const config = require('../config/config.js');
let winston = require('../config/winston');
//const Promise = require('bluebird');
const rp = require('request-promise-native');
const projects = require('../routes/projects');

//const delay = require('delay');

function loggingDate () {
    return new Date().toUTCString();
}

module.exports.loggingDate = loggingDate();


/**
 * General HTTP Request
 * @param options // Request Promise options object
 * @returns {*}
 */
async function httpRequest (options) {

    winston.log('debug', 'HTTP Options - ' + options + ' - ' + new Date());

    try {
        let response = await rp(options);

        winston.log('debug', 'HTTP Request - ' + config.messages.statusCode +
            response.statusCode + ' - ' + new Date());

        return (response.body);

    } catch (err) {
        winston.log('error', config.messages.requestError + err + ' - ' + new Date());
    }

}

module.exports.httpRequest = httpRequest;
