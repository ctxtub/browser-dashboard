/*
 * @Author: Tensho Chen 
 * @Date: 2017-03-23 20:50:02 
 * @Last Modified by: Tensho Chen
 * @Last Modified time: 2017-03-24 10:30:53
 */


var express = require('express');
var router = express.Router();
var bingPicApi = require('./api-subRouter/bingPicApi');
var sayingApi = require('./api-subRouter/sayingApi');

router.use('/bingimage', bingPicApi);
router.use('/saying', sayingApi);

module.exports = router;