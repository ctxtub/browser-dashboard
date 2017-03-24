/*
 * @Author: Tensho Chen 
 * @Date: 2017-03-23 10:13:12 
 * @Last Modified by:   Tensho Chen 
 * @Last Modified time: 2017-03-23 23:20:12 
 */


var mongoose = require('mongoose');
var db = require('../connectMailDB');

var Schema = mongoose.Schema;
var MailLoginSchema = new Schema({
	ip: String,
	timestamp: Number,
	createTime: String
});
var LoginModel = db.model('login', MailLoginSchema);


module.exports = LoginModel;