let winston = require('../config/winston');
const Promise = require('bluebird');
const config = require('../config/config.js');

/**
 *
 * @type {{flattenJson: (function(*=)), unFlattenJson: module.exports.unFlattenJson}}
 */
module.exports = {

  /**
   * Flattens (unwinds) a nested json object and returns a single level object.
   * @param jsonObject
   * @returns {*}
   */
  flattenJson: function(jsonObject) {
    return new Promise(async function(resolve, reject) {
      try {
        let flatObject = {};

        if (jsonObject) {
          function recurse(cur, prop) {
            if (Object(cur) !== cur) {
              flatObject[prop] = cur;
            } else if (Array.isArray(cur)) {
              let l = cur.length;
              if (l === 0) {
                flatObject[prop] = [];
              } else {
                let a = cur.length;
                for (let i = 0; i < a; i++) {
                  //recurse(cur[i], prop + '[' + i + ']');
                  recurse(cur[i], prop);
                  //ToDo - Check logic to deal with empty field "SDK"
                }
              }
            } else {
              let isEmpty = true;
              for (let p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + '.' + p : p);
              }
              if (isEmpty && prop) flatObject[prop] = {};
            }
          }

          recurse(jsonObject, '');
        } else {
          winston.log('debug', 'Function flattenJson: Object is null - ' +
              config.loggerDate());
          return reject('Function flattenJson: Object is null');
        }
        return resolve(flatObject);
      } catch (error) {
        return reject(error);
      }
    });
  },

  /**
   * Unflattens a single level object and returns a nested json object.
   *
   * @param jsonObject
   * @returns {*}
   */
  unFlattenJson: function(jsonObject) {
    'use strict';
    if (Object(jsonObject) !== jsonObject ||
        Array.isArray(jsonObject)) return jsonObject;
    let regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    for (let p in jsonObject) {
      let cur = resultholder,
          prop = '',
          m;
      while (m = regex.exec(p)) {
        cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
        prop = m[2] || m[1];
      }
      cur[prop] = jsonObject[p];
    }
    return resultholder[''] || resultholder;
  },

  /**
   * Flattens (unwinds) the projects list nested json object and returns a single level object.
   * @param jsonObject
   * @param filters
   * @returns {Array}
   */
  flattenProjects: function(jsonObject, filters) {
    return new Promise(async function(resolve, reject) {
      try {
        let result = [];
        for (let i = 0, len = jsonObject.length; i < len; i++) {
          if (filters) {
            if (filters.indexOf(jsonObject.project_id) < 0) {
              result.push(await module.exports.flattenJson(jsonObject[i]));
            }
          } else {
            result.push(await module.exports.flattenJson(jsonObject[i]));
          }
        }
        return resolve(result);
      } catch (error) {
        return reject(error);
      }
    });
  },

  replacePlaceholder: function(original, value) {
    return original.replace(/%\w+%/g, value);
  },

};