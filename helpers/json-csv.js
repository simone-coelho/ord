const util = require('util');
const fse = require('fs-extra');
const Json2csvParser = require('json2csv').Parser;
const jsonUtils = require('../helpers/json-utils');
const fileUtils = require('../helpers/file-utils');
const path = require('path');
const winston = require('../config/winston');
const Promise = require('bluebird');
const config = require('../config/config.js');

/**
 *
 * @param dataObj
 * @returns {Promise<void>}
 */
async function jsonToCSV(dataObj, writeFiles) {

  let flatJsonObj = dataObj.jsonSchema;//[0];
  const tempDirPath = path.join(fileUtils.tempDir, dataObj.fileName);

  try {
    await fse.remove(tempDirPath);
    await fse.ensureDir(tempDirPath);

    if (dataObj.flatten) {
      flatJsonObj = await jsonUtils.flattenJson(dataObj.jsonSchema[0]);
      let convertedArray = [];
      convertedArray.push(flatJsonObj);
      if (writeFiles === true) {
        await fileUtils.writeFile(
            path.join(tempDirPath, dataObj.fileName + '_flat.txt'),
            util.inspect(convertedArray, {
              maxArrayLength: null,
              depth: null,
            }),
        );
        // console.log(
        //     util.inspect(convertedArray, {maxArrayLength: null, depth:
        // null}));
      }
    }

    let keys = [];
    for (let k in flatJsonObj) keys.push(k);
    if (writeFiles === true) {
      await fileUtils.writeFile(
          path.join(tempDirPath, dataObj.fileName + '_keys.txt'),
          util.inspect(keys, {
            maxArrayLength: null,
            depth: null,
          }),
      );
      console.log(util.inspect(keys, {
        maxArrayLength: null,
        depth: null,
      }));
    }

    const fields = dataObj.fieldsData;
    const json2csv = new Json2csvParser({
                                          fields,
                                          unwind: dataObj.unwindData,
                                          header: true,
                                        });

    let csvFile;
    if (writeFiles === true) {
      csvFile = await json2csv.parse(dataObj.jsonSchema[0]);
    } else {
      csvFile = await json2csv.parse(flatJsonObj);
    }
    if (writeFiles === true) {
      await fileUtils.writeFile(
          path.join(tempDirPath, dataObj.fileName + '_rows.csv'), csvFile);
    }
    return csvFile;
    //console.log(csv);
  } catch (err) {
    winston.log('error', 'JSON to CSV: ' + err);
  }
}

module.exports.jsonToCSV = jsonToCSV;

