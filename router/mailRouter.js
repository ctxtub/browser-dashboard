/*
 * @Author: Tensho Chen 
 * @Date: 2017-03-22 20:51:37 
 * @Last Modified by: Tensho Chen
 * @Last Modified time: 2017-03-23 23:15:52
 */


var express = require('express');
var request = require('request');
var router = express.Router();
var MailModel = require('../mongoJs/mailModel/loginModel');

var mailObj = {};

//邮箱 请求一系列中间件
router.use('/', getMailToken, getMailUrl, saveLoginData);

//点击跳转邮箱后链接转向
router.get('/', function (req, res) {
  res.redirect(mailObj.login_url);
});


//中间件函数 请求总token 7200s有效期
function getMailToken(req, res, next) {

  request.get('https://api.exmail.qq.com/cgi-bin/gettoken?corpid=QQ企业邮箱内获取', function (error, response, body) {

    if (error) console.log('token请求错误：' + error);
    var body = JSON.parse(body);
    mailObj.token = body.access_token;
    next();
  });
}

//中间件函数 请求总个人邮箱登录地址
function getMailUrl(req, res, next) {
  //请求当前用户登录地址 	//300s有效期
  request.get('https://api.exmail.qq.com/cgi-bin/service/get_login_url?access_token=' + mailObj.token + '&userid=about@ctxtub.com', function (error, response, body) {

    if (error) console.log('登录链接请求错误：' + error);
    var body = JSON.parse(body);
    mailObj.login_url = body.login_url;
    next();
  });
}

function saveLoginData(req, res, next) {
  var clientIp = getClientIp(req);
  MailModel.create({
    ip: clientIp,
    timestamp: +new Date(),
    createTime: new Date().toUTCString()
  }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('mailLogin储存 ->' + 'ip:' + data.ip + ' saved.');
    }
  });
  next();
}

//获取客户端IP
function getClientIp(req) {
  var ipAddress;
  var forwardedIpsStr = req.header('x-forwarded-for');
  if (forwardedIpsStr) {
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
}

module.exports = router;