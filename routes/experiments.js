let express = require('express');
let router = express.Router();
let jsonUtils = require('../helpers/json-utils');
let config = require('../config/config.js');
let winston = require('../config/winston');

/* GET experiments listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
