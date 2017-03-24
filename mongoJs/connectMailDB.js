/*
 * @Author: Tensho Chen 
 * @Date: 2017-03-23 10:12:10 
 * @Last Modified by: Tensho Chen
 * @Last Modified time: 2017-03-25 00:11:36
 */


var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// 获得db对象
//远程数据库建议自建 如需无存储需求，可使用本站提供的API
//var db = mongoose.createConnection('mongodb://userName:Password@ip:27017/mailDB');

//本地数据库
var db = mongoose.createConnection('mongodb://localhost:27017/mailDB');

db.on('error', console.error.bind(console, 'mailDB数据库连接错误:'));

db.on('connected', () => {
  console.log('mailDB数据库连接成功！');
});

module.exports = db;