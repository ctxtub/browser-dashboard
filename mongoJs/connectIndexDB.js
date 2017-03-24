/*
 * @Author: Tensho Chen 
 * @Date: 2017-03-22 21:12:40 
 * @Last Modified by: Tensho Chen
 * @Last Modified time: 2017-03-24 19:18:08
 */


var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// 获得db对象
//远程数据库建议自建 如需无存储需求，可使用本站提供的API
//var db = mongoose.createConnection('userName:Password@ip:27017/indexDB');

//本地数据库
var db = mongoose.createConnection('mongodb://localhost:27017/indexDB');

db.on('error', console.error.bind(console, 'indexDB数据库连接错误:'));

db.on('connected', () => {
  console.log('indexDB数据库连接成功！');
});

module.exports = db;