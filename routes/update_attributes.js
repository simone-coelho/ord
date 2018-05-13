const express = require('express');
const router = express.Router();
const jsonUtils = require('../helpers/json-utils');
const httpUtils = require('../helpers/http-utils');
const config = require('../config/config.js');
let winston = require('../config/winston');
const Promise = require('bluebird');
const rp = require('request-promise-native');
const projects = require('../routes/projects');
const delay = require('delay');

/**
 * Generates a list of URLs to retrieve all attribute list for projects in the list
 * Includes the "Auth Beareer Token"
 * @param projectList
 */
function getAttributeURLS (projectList) {
    return new Promise(function (resolve, reject) {
        let projectItems = [];
        for (let i = 0; i < projectList.length; i++) {

            let reqOptions = {
                url: jsonUtils.replacePlaceholder(
                    config.apiEndpoints.attributesList, projectList[i].id) +
                '&page=1&per_page=100',
                headers: config.auth.authHeader,
                json: true,
                resolveWithFullResponse: true
            };

            projectItems.push(reqOptions);
        }
        resolve(projectItems);
    });
}

/**
 * HTTP POST Route => PATCH
 * Updates all available attributes
 *
 * ToDo - Add filtering params object to exclude projects...
 */
router.post('/', function (req, res, next) {

    projects.getProjectsList([]).then(function (projectList) {
        jsonUtils.flattenProjects(projectList).then(function (flatProjectList) {
            getAttributeURLS(flatProjectList).then(function (urlList) {
                getAttributesList(urlList).then(function (allAttrList) {
                    getAttributeUpdateURLS(allAttrList).
                        then(function (attrList) {
                            updateAttributes(attrList).then(function (results) {

                                console.log(results.length +
                                    ' attributes updated');
                                res.send('Done');
                            });
                        });
                });
            });
        });
    });
});

/**
 * Retrieves all attributes for each individual project passed in the formatted url list
 * @param urlList
 * @returns {Promise<Array>}
 */
async function getAttributesList (urlList) {

    let attributesList = [];

    /**
     * HTTP GET
     * Retrieve all available attributes
     */
    for (let url of urlList) {
        try {
            let response = await rp(url);

            if (response.statusCode === 200) {
                attributesList.push(response.body);
                winston.log('info', 'API: List Attributes - ' +
                    config.messages.statusCode + response.statusCode + ' - ' + new Date());
                // winston.log('info', 'Header: List Attributes - ' + config.messages.statusCode +
                //   response.rawHeaders);
            }
        } catch (error) {
            winston.log('error', 'API: List Attribute - ' +
                config.messages.requestError + error + ' - ' + new Date());
        }
    }

    return attributesList;
}

/**
 * Builds all the update URLs and body payload to PATCH the corresponding attribute
 * @param allProjectsAttrLists
 */
function getAttributeUpdateURLS (allProjectsAttrLists) {
    return new Promise(function (resolve, reject) {
        let attrItems = [];
        for (let projectAttrList of allProjectsAttrLists) {

            if (projectAttrList.length > 0) {

                for (let attribute of projectAttrList) {

                    const attrKey = attribute.key;

                    // Check for a numeric ID and length = 6 & is a number
                    if ((attrKey.length = 6) && (!isNaN(attrKey))) {

                        let reqAttrOptions = {
                            method: 'PATCH',
                            body: {},
                            url: jsonUtils.replacePlaceholder(
                                config.apiEndpoints.attributes, attribute.id),
                            headers: config.auth.authHeader,
                            json: true,
                            resolveWithFullResponse: true
                        };

                        let newAttribute = {};
                        newAttribute.key = attribute.key + '_' +
                            getAttributeCode(attribute.project_id);
                        newAttribute.name = attribute.name;
                        newAttribute.description = attribute.description;
                        reqAttrOptions.body = newAttribute;

                        attrItems.push(reqAttrOptions);
                    }
                }
            }
        }
        resolve(attrItems);
    });
}

/**
 * Updates (PATCH) all the attributes passed in the request options configuration
 * @param allAttrOptions // holds the request options and body payload JSON
 * @returns {Promise<Array>}
 */
async function updateAttributes (allAttrOptions) {

    let resultList = [];

    for (let attrOptions of allAttrOptions) {

        try {
            let response = await rp(attrOptions);

            if (response.statusCode === 200) {
                winston.log('info', 'API: Update Attribute - ' +
                    config.messages.statusCode + response.statusCode + ' - ' + new Date());
            }

            resultList.push(response.project_id);

        } catch (error) {
            winston.log('error', 'API: Update Attribute - ' +
                config.messages.requestError + error + ' - ' + new Date());
        }
    }
    return (resultList);
}

function getAttributeCode (id) {
    return attrCode[attrId.indexOf(id)];
}

const attrName = [
    'Analytics',
    'Asia Pacific',
    'Blockchain',
    'Blogs',
    'Bluemix dev',
    'Bluemix prod',
    'Bluewolf',
    'China',
    'CHQ + Homepage',
    'Cloud',
    'Commerce',
    'DBG',
    'DBG architecture',
    'developerWorks',
    'Drupal',
    'Europe',
    'Events',
    'Forms',
    'Global Business Services',
    'Global Financing',
    'Global Technology Services',
    'IBM ID',
    'IBM w3',
    'Industries',
    'Japan',
    'Latin America',
    'Live Chat',
    'Live Chat Full Stack',
    'Marketplace',
    'Middle East & Africa',
    'North America',
    'Partnerworld',
    'Product Pages',
    'Search',
    'Security',
    'Social',
    'Systems',
    'Think Marketing Hub',
    'Watson',
    'Watson IoT'];

const attrCode = [
    'anly',
    'apac',
    'bchn',
    'blog',
    'bdev',
    'bpro',
    'blwf',
    'chna',
    'chq',
    'cld',
    'cmrc',
    'dbg',
    'dbga',
    'dvwk',
    'drpl',
    'euro',
    'evnt',
    'frms',
    'gbs',
    'igf',
    'gts',
    'id',
    'w3',
    'inds',
    'jpan',
    'ltam',
    'lvch',
    'lcfs',
    'mrkt',
    'mea',
    'na',
    'prtn',
    'prod',
    'srch',
    'sec',
    'socl',
    'syst',
    'thnk',
    'wtsn',
    'wiot '];

const attrId = [
    3737530932,
    3710785529,
    8797450685,
    3955660784,
    7964536850,
    7959095123,
    8202065267,
    3533593215,
    3867211201,
    3515500456,
    3519582641,
    8317179112,
    0,
    5399420604,
    8388713057,
    3721607435,
    4134970626,
    9266425126,
    3695451849,
    3741712352,
    3752260522,
    4855523797,
    9109064843,
    8241256560,
    3738429769,
    3738733233,
    8326290211,
    8477910064,
    5176491676,
    3744610158,
    3740664099,
    6178492718,
    8437383670,
    8724913630,
    3692941844,
    5402591673,
    3734808707,
    8039081053,
    2972860641,
    8250454094];

module.exports = router;
