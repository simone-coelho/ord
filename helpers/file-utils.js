const fse = require('fs-extra');
const path = require('path');
const winston = require('../config/winston');
const Promise = require('bluebird');

module.exports.rootDir = path.resolve('../optly_dashboard');
module.exports.tempDir = path.join(module.exports.rootDir, 'temp');

function readFile (filePath) {
    return new Promise((resolve, reject) => {
        fse.readFile(filePath, (err, data) => {
            if (err) {
                winston.log('error', 'Reading file: ' + filePath + ' - ' + err);
                return reject(err);
            }
            resolve(data);
        });
    });
}

function writeFile (filePath, data) {
    return new Promise((resolve, reject) => {
        fse.writeFile(filePath, data, (err) => {
            if (err) {
                winston.log('error', 'Writing file: ' + filePath + ' - ' + err);
                return reject(err);
            }
            resolve(data.length);
        });
    });
}

let deleteFolderRecursive = function (dirPath) {
    if (fse.existsSync(dirPath)) {
        fse.readdirSync(dirPath).forEach(function (file, index) {
            let curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
};

module.exports.readFile = readFile;
module.exports.writeFile = writeFile;
module.exports.deleteFolderRecursive = deleteFolderRecursive;