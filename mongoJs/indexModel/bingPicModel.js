/*
 * @Author: Tensho Chen 
 * @Date: 2017-03-22 23:27:03 
 * @Last Modified by: Tensho Chen
 * @Last Modified time: 2017-03-25 00:12:17
 */


var mongoose = require('mongoose');
var db = require('../connectIndexDB');

var Schema = mongoose.Schema;
var BingPicSchema = new Schema({
  link: String,
  timestamp: Number,
  createTime: String,
  copyright: String
});
var BingPicModel = db.model('BingPic', BingPicSchema);

module.exports = BingPicModel;