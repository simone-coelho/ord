const express = require('express');
const router = express.Router();
const config = require('../../config/config.js');
const winston = require('../../config/winston');
const request = require('request');
const rp = require('request-promise-native');

/**
 * API endpoint for retrieving and listing all projects and "Auth Beareer Token"
 * @type {{url: string, headers: ({Authorization: string}|config.auth.authHeader|{Authorization}), json: boolean, resolveWithFullResponse: boolean}}
 */
const reqOptions = {
  url: config.apiEndpoints.projectsList + '?page=1&per_page=100',
  headers: config.auth.authHeader,
  json: true,
  resolveWithFullResponse: true,
};

/**
 * Returns a list of all projects in a flatten Json
 * filters are used to exclude projects from the result set
 * @param filters
 * @returns {*}
 */
function getProjectsList(filters) {
  return rp(reqOptions).then(function(response) {
    winston.log('debug', 'API: List Projects - ' + config.messages.statusCode +
        response.statusCode + ' - ' + config.loggerDate());

    return response.body;
  }).catch(function(err) {
    winston.log('error', config.messages.requestError + err + ' - ' +
        config.loggerDate());
  });
}

/**
 * HTTP GET
 * Retrieve all available projects
 */
router.get('/', function(req, res, next) {
  getProjectsList([]).then(function(projectList) {
    res.json(projectList);
  });
});

/**
 * HTTP POST
 * Create a new a project
 */
router.post('/', function(req, res, next) {

  request.post(reqOptions, function(error, response, body) {

    if (!error && response.statusCode === 200) {
      winston.log('debug', 'API: List Projects - ' +
          config.messages.statusCode + response.statusCode + ' - ' +
          config.loggerDate());

      //
    } else {
      winston.log('error', config.messages.requestError + error + ' - ' +
          config.messages.statusCode + response.statusCode + ' - ' +
          config.loggerDate());
      next();
    }

  });
});

/**
 * HTTP PATCH
 * Update an existing project
 */
router.patch('/', function(req, res, next) {

  request.patch(reqOptions, function(error, response, body) {

    if (!error && response.statusCode === 200) {
      winston.log('debug', 'API: List Projects - ' +
          config.messages.statusCode + response.statusCode + ' - ' +
          config.loggerDate());

      //
    } else {
      winston.log('error', config.messages.requestError + error + ' - ' +
          config.messages.statusCode + response.statusCode + ' - ' +
          config.loggerDate());
      next();
    }

  });
});

/************************************* Local Functions *************************************/



module.exports = router;
module.exports.getProjectsList = getProjectsList;
