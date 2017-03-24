/*
 * @Author: Tensho Chen 
 * @Date: 2017-01-13 01:09:38 
 * @Last Modified by: Tensho Chen
 * @Last Modified time: 2017-03-24 19:16:47
 */

// 启动mongoDB :mongod -dbpath ./db
var openBrowser = require('child_process');
var express = require('express');
var path = require('path');
var app = express();

var apiRouter = require('./router/apiRouter');
var mailRouter = require('./router/mailRouter');
var indexRouter = require('./router/indexRouter');

//模板引擎设置
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
//模板&静态资源路径
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));


app.use('/mail', mailRouter);
app.use('/u', indexRouter);
app.use('/api', apiRouter);

//错误页面处理，重定向
app.get('*', function (req, res) {
	res.redirect('/u');
});

//监听端口
var port = process.env.PORT || 8081;
app.listen(port);
console.log('端口已开启' + port);

//自动打开浏览器 渲染页面
openBrowser.exec('start http://127.0.0.1:8081/u/User');