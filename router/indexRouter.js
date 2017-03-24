/*
 * @Author: Tensho Chen 
 * @Date: 2017-03-22 20:47:30 
 * @Last Modified by: Tensho Chen
 * @Last Modified time: 2017-03-25 00:10:33
 */


var express = require('express');
var request = require('request');
var router = express.Router();
var SayingModel = require('../mongoJs/indexModel/sayingModel');
var BgModel = require('../mongoJs/indexModel/bingPicModel');

/*路由和中间件*/
var indexObj = {};

router.use('/', getLocalData);

router.get('/', function (req, res) {
  console.log('未自定义主页面渲染', +new Date(), '\n');
  indexObj.title = '你好，朋友';
  res.render('unlogpage', indexObj);
  updateIndexDate();
});

router.use('/:name', getGreeting);
router.get('/:name', function (req, res) {
  console.log('自定义主页面渲染', +new Date(), '\n');
  res.render('index', indexObj);
  updateIndexDate();
});


//中间件函数 获取问候语
function getGreeting(req, res, next) {

  indexObj.title = greeting() + ', ' + req.params.name;
  next();

}

// 问候语函数
function greeting() {
  var time = (new Date()).getHours();
  if (time >= 6 && time < 12) {
    return '早上好';
  } else if (time >= 12 && time < 14) {
    return '中午好';
  } else if (time >= 14 && time < 18) {
    return '下午好';
  } else if (time >= 18 && time < 24) {
    return '晚上好';
  } else if (time >= 0 && time < 6) {
    return '凌晨好';
  }
}

// 获取本地数据库 图片及格言数据。
function getLocalData(req, res, next) {
  var count = 0;
  BgModel.find().sort('-timestamp').limit(1).exec((err, data) => {
    if (err) {
      console.log(err);
    } else {
      count++;
      if (data[0]) {
        indexObj.bingurl = data[0].link;
      } else {
        console.log('BgModel数据不存在');
      }
      if (count === 2) next();
    }
  });
  SayingModel.find().sort('-timestamp').limit(1).exec((err, data) => {
    if (err) {
      console.log(err);
    } else {
      count++;
      if (data[0]) {
        indexObj.cnSaying = data[0].cn;
        indexObj.enSaying = data[0].en;
      } else {
        console.log('SayingModel数据不存在');
      }
      if (count === 2) next();
    }
  });
}

// 更新数据库中 图片及格言数据。
function updateIndexDate() {
  //获取背景图
  request.get('http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1', function (error, response, body) {

    if (error) console.log('背景图请求错误：' + error);
    var body = JSON.parse(body);
    var bingurl = 'http://www.bing.com' + body.images[0].url;

    BgModel.findOne({
      link: bingurl
    })
      .exec((err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data) {
            console.log('BingPic数据已存在，抛弃');
          } else {
            BgModel.create({
              link: bingurl,
              timestamp: +new Date(),
              createTime: body.images[0].startdate,
              copyright: body.images[0].copyright
            }, (err, data) => {
              if (err) {
                console.log(err);
              } else {
                console.log('BingPic储存 -> ' + 'link[' + data.link + '] saved.');
              }
            });
          }
        }
      });

  });

  //获取名言警句
  request.get('https://api.hzy.pw/saying/v1/ciba', function (error, response, body) {

    if (error) console.log('名言警句请求错误：' + error);
    var body = JSON.parse(body);
    var cnSaying = body.cn;
    var enSaying = body.en;

    SayingModel.findOne({
      cn: cnSaying
    })
      .exec((err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data) {
            console.log('saying数据已存在，抛弃');
          } else {
            SayingModel.create({
              cn: cnSaying,
              en: enSaying,
              timestamp: +new Date(),
              createTime: new Date().toUTCString()
            }, (err, data) => {
              if (err) {
                console.log(err);
              } else {
                console.log('saying储存 -> ' + 'cn[' + data.cn + '] saved.');
              }
            });
          }
        }
      });

  });

}


module.exports = router;