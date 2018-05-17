const express = require('express');
const router = express.Router();
const jsonUtils = require('../../helpers/json-utils');
const config = require('../../config/config.js');
const winston = require('../../config/winston');
const placeHolder = require('string-placeholder');
const rp = require('request-promise-native');
const projectsTransform = require('./../../db_transform/dbt_projects');
const updateDatabase = require('./../../db/update_database');

// Initialize Header Authorization Token
config.auth.authHeaderAcct.Authorization =
    placeHolder(config.auth.authHeaderAcct.Authorization,
                {token: config.auth.activeToken},
    );

/**
 * API endpoint for retrieving and listing all projects and "Auth Bearer Token"
 * @type {{url: string, headers: ({Authorization:
 *     string}|config.auth.authHeaderAcct|{Authorization}), json: boolean,
 *     resolveWithFullResponse: boolean}}
 */
let reqOptProjects = {
  url: config.apiEndpoints.projectsList + '?page=${page}&per_page=100',
  headers: config.auth.authHeaderAcct,
  json: true,
  resolveWithFullResponse: true,
};

/**
 * API endpoint for retrieving a single project and "Auth Bearer Token"
 * @type {{url: string, headers: ({Authorization:
 *     string}|config.auth.authHeaderAcct|{Authorization}), json: boolean,
 *     resolveWithFullResponse: boolean}}
 */
let reqOptProject = {
  url: config.apiEndpoints.project,
  headers: config.auth.authHeaderAcct,
  json: true,
  resolveWithFullResponse: true,
};

/**
 * HTTP GET - Update Projects DB Table
 * Retrieve all available projects by account
 * ToDo - Logic to get token for account from DB - req.params.accountdId
 */
router.get('/database/init', function(req, res, next) {

  getProjectsList(reqOptProjects)
      .then(function(projectList) {
        jsonUtils.flattenProjects(projectList)
            .then(function(flatProjectList) {
              projectsTransform.transformObjToCSV(flatProjectList)
                  .then(async function(projectCSV) {
                    await updateDatabase.copyToDatabase(
                        projectCSV, 'tbl_projects')
                        .then(function(result) {
                          res.json({Result: result});
                        });
                  });
            });
      });
});

/**
 * Returns a list of all projects
 * account_id is used to get projects based on account_id token
 * @param requestOptions
 * @returns {*}
 */
function getProjectsList(requestOptions) {

  let reqOptions = Object.assign(requestOptions);
  reqOptions.url = placeHolder(requestOptions.url, {page: '1'});

  return rp(reqOptions)
      .then(function(response) {
        winston.log('debug', 'API: List Projects - ' +
            config.messages.statusCode + response.statusCode + ' - ' +
            config.loggerDate());

        return response.body;
      })
      .catch(function(err) {
        winston.log('error', config.messages.requestError + err + ' - ' +
            config.loggerDate());
      });
}

/**
 * HTTP GET
 * Retrieve all available projects
 */
router.get('/', function(req, res, next) {
  getProjectsList(reqOptProjects)
      .then(function(projectList) {
        res.json(projectList);
      });
});

/**
 * HTTP GET
 * Retrieve all available projects by account
 * ToDo - Logic to get token for account from DB - req.params.accountdId
 */
router.get('/:account', function(req, res, next) {
  //req.params.accountId
  getProjectsList(reqOptProjects)
      .then(function(projectList) {
        res.json(projectList);
      });
});

/**
 * Returns a single project
 * @param project_id
 * @param requestOptions
 * @returns {*}
 */
function getProject(project_id, requestOptions) {

  let reqOptions = Object.assign(requestOptions);
  reqOptions.url = placeHolder(requestOptions.url, {id: '1'});

  return rp(requestOptions)
      .then(function(response) {
        winston.log('debug', 'API: Read Single Project - ' +
            config.messages.statusCode + response.statusCode + ' - ' +
            config.loggerDate());

        return response.body;
      })
      .catch(function(err) {
        winston.log('error', config.messages.requestError + err + ' - ' +
            config.loggerDate());
      });
}

/**
 * HTTP GET
 * Retrieves an individual project
 * ToDo - Logic to get token for account from DB
 */
router.get('/project/:project', function(req, res, next) {
  getProject(req.params.project, reqOptProject)
      .then(function(project) {
        res.json(project);
      });
});

/**
 * Creates a new project or updates an existing project
 * based on the httpMethod "POST" for new or "PATCH" to update
 * @param projectJson
 * @param requestOptions
 * @param httpMethod
 * @returns {*}
 */
function createProject(projectJson, requestOptions, httpMethod) {

  let reqOptions = Object.assign(requestOptions);
  reqOptions.url = config.apiEndpoints.projectsList;
  reqOptions.body = projectJson;
  reqOptions.method = httpMethod;

  return rp(reqOptions)
      .then(function(response) {
        winston.log('debug', 'API: Create New Project - ' +
            config.messages.statusCode + response.statusCode + ' - ' +
            config.loggerDate());

        return response.body;
      })
      .catch(function(err) {
        winston.log('error', config.messages.requestError + err + ' - ' +
            config.loggerDate());
      });
}

/**
 * HTTP POST
 * Create a new a project
 */
router.post('/', function(req, res, next) {

  createProject(req.body, reqOptProjects, 'POST')
      .then(function(project) {
        res.json(project);
      });

});

/**
 * HTTP PATCH
 * Update an existing project
 */
router.patch('/', function(req, res, next) {

  createProject(req.body, reqOptProjects, 'PATCH')
      .then(function(project) {
        res.json(project);
      });

});

module.exports = router;
module.exports.getProjectsList = getProjectsList;
