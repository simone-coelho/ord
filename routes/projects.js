let express = require('express');
let router = express.Router();
let jsonUtils = require('../helpers/json-utils');
let config = require('../config/config.js');
let winston = require('../config/winston');
let request = require('request');
let rp = require('request-promise-native');

/**
 * API endpoint for retrieving and listing all projects and "Auth Beareer Token"
 * @type {{url: string, headers: ({Authorization: string}|config.auth.authHeader|{Authorization}), json: boolean, resolveWithFullResponse: boolean}}
 */
let reqOptions = {
    url: config.apiEndpoints.projectsList + '?page=1&per_page=100',
    headers: config.auth.authHeader,
    json: true,
    resolveWithFullResponse: true
};

/**
 * Returns a list of all projects in a flatten Json
 * filters are used to exclude projects from the result set
 * @param filters
 * @returns {*}
 */
function getProjectsList (filters) {
    return rp(reqOptions).then(function (response) {
        winston.log('info', 'API: List Projects - ' +
            config.messages.statusCode + response.statusCode + ' - ' +
        new Date());

        return response.body;
    }).catch(function (err) {
        winston.log('error', config.messages.requestError + err + ' - ' +
            new Date());
    });
}

/**
 * HTTP GET
 * Retrieve all available projects
 */
router.get('/', function (req, res, next) {
    getProjectsList([]).then(function (projectList) {
        res.json(projectList);
    });
});

/**
 * HTTP POST
 * Create a new a project
 */
router.post('/', function (req, res, next) {

    request.post(reqOptions, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            winston.log('info', 'API: List Projects - ' +
                config.messages.statusCode + response.statusCode + ' - ' +
                new Date());

            //
        } else {
            winston.log('error', config.messages.requestError + error + ' - ' +
                config.messages.statusCode + response.statusCode + ' - ' +
                new Date());
            next();
        }

    });
});

/**
 * HTTP PATCH
 * Update an existing project
 */
router.post('/', function (req, res, next) {

    request.patch(reqOptions, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            winston.log('info', 'API: List Projects - ' +
                config.messages.statusCode + response.statusCode + ' - ' +
                new Date());

            //
        } else {
            winston.log('error', config.messages.requestError + error + ' - ' +
                config.messages.statusCode + response.statusCode + ' - ' +
                new Date());
            next();
        }

    });
});

/************************************* Local Functions *************************************/



module.exports = router;
module.exports.getProjectsList = getProjectsList;

// function getProjectsList(filters) {
//   // Create a new Promise
//   return new Promise(function (resolve, reject) {
//     rp(reqOptions)
//     .then(function (response) {
//       winston.log('info', 'API: List Projects - ' + config.messages.statusCode + response.statusCode);
//
//       //Normalize and flatten Json...
//       resolve(JSON.stringify(jsonUtils.flattenProjects(response.body)));
//     })
//     .catch(function (err) {
//       winston.log('error', config.messages.requestError + err);
//       reject(err);
//     });
//   });
// }