/**
 * config.js
 *
 */

/**
 *
 * Object holding default configuration values, messages and API Endpoints
 * @type {{apiEndpoints: {projectsList: string, project: string, campaignsList: string, campaign: string, experimentsList: string, experiment: string, audienceList: string, audiences: string}, db: {host: string, port: number, name: string}, debugLevel: {info: string, verbose: string, debug: string, error: string}, auth: {token: string, authHeader: {Authorization: string}}, messages: {expressError: string, requestError: string, invalidParameters: string, statusCode: string}, environment: {serverType: string}}}
 */
const config = {
  apiEndpoints: {
    projectsList: 'https://api.optimizely.com/v2/projects',
    project: 'https://api.optimizely.com/v2/projects/%id%',
    campaignsList: 'https://api.optimizely.com/v2/campaigns?project_id=%id%',
    campaign: 'https://api.optimizely.com/v2/campaigns/%id%',
    experimentsList: 'https://api.optimizely.com/v2/experiments?project_id=%id%',
    experiment: 'https://api.optimizely.com/v2/experiments/%id%',
    audienceList: 'https://api.optimizely.com/v2/audiences?project_id=%id%',
    audiences: 'https://api.optimizely.com/v2/audiences/%id%',
    attributesList: 'https://api.optimizely.com/v2/attributes?project_id=%id%',
    attributes: 'https://api.optimizely.com/v2/attributes/%id%',
  }, db: {
    host: 'localhost', port: 27017, name: 'db',
  }, debugLevel: {
    info: 'info',
    verbose: 'verbose',
    debug: 'debug',
    error: 'error',
    warning: 'warning',
    none: 'none',
  }, auth: {
    token: '2:nkzzrXzzYujxYVu4MTKypnD3TbkRFdo4-k7lULDDVqJG8RaRwT-A',
    authHeader: {'Authorization': 'Bearer 2:nkzzrXzzYujxYVu4MTKypnD3TbkRFdo4-k7lULDDVqJG8RaRwT-A'},
    sessionSecret: 'asdflkjhg123456789mnbvcxz',
  }, messages: {
    expressError: 'Express: ',
    requestError: 'Something went wrong on the remote server request: ',
    invalidParameters: 'Express - Invalid Parameters: ',
    statusCode: 'Status Code: ',
  }, // [ development, production ]
  environment: {
    serverType: 'development',
  }, loggerDate: function() {
    return new Date();
  },
};

module.exports = config;