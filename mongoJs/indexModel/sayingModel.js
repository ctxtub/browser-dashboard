/*
 * @Author: Tensho Chen 
 * @Date: 2017-03-22 23:29:37 
 * @Last Modified by:   Tensho Chen 
 * @Last Modified time: 2017-03-23 23:20:37 
 */


var mongoose = require('mongoose');
var db = require('../connectIndexDB');

var Schema = mongoose.Schema;
var SayingSchema = new Schema({
	cn: String,
	en: String,
	timestamp: Number,
	createTime: String
});
var SayingModel = db.model('saying', SayingSchema);


module.exports = SayingModel;