const express = require('express');
const router = express.Router();
const jsonUtils = require('../helpers/json-utils');
const config = require('../config/config');
const winston = require('../config/winston');

/* GET experiments listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
