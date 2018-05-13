const config = require('../config/config');
let winston = require('../config/winston');
//const Promise = require('bluebird');
const rp = require('request-promise-native');


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

    winston.log('debug', 'HTTP Options - ' + options + ' - ' +
        config.loggerDate());

    try {
        let response = await rp(options);

        winston.log('debug', 'HTTP Request - ' + config.messages.statusCode +
            response.statusCode + ' - ' + config.loggerDate());

        return (response.body);

    } catch (err) {
        winston.log('error', config.messages.requestError + err + ' - ' +
            config.loggerDate());
    }

}

module.exports.httpRequest = httpRequest;
