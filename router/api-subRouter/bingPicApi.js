/*
 * @Author: Tensho Chen 
 * @Date: 2017-03-23 21:24:08 
 * @Last Modified by: Tensho Chen
 * @Last Modified time: 2017-03-25 00:11:09
 * 
 * API说明：
 *  接收字段：size （必填）
 *      合法类型：正负数字
 *      作用：填写正数时返回最新的数据
 *            填写负数时返回最旧的数据
 *            最多返回8条数据！
 *  接收字段：ramdom （可选）
 *      合法类型：1, 0，ture, false 任意一个
 *      作用：填写1, ture时返回随机的数据
 *           填写0, false时返回size约定的数据

 */


var express = require('express');
var router = express.Router();
var BgModel = require('../../mongoJs/indexModel/bingPicModel');
var RestResult = require('./RestResult');

router.get('/', (req, res) => {
  var restResult = new RestResult();
  var size = req.query.size;
  var ramdom = req.query.ramdom;
  var sizeSort = null;
  
  // 验证是否输入size
  if (!size) {
    restResult.errorCode = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
    restResult.errorReason = '请填写size字段！';
    res.send(restResult);
    return;
  }

  // 验证size是否是数字
  if (!(/^(-)?(\d)+$/.test(size))) {
    restResult.errorCode = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
    restResult.errorReason = 'size字段为数字！';
    res.send(restResult);
    return;
  }
  //size 通过验证 分解size
  sizeSort = /^-/.test(size) ? 'timestamp' : '-timestamp';
  size = size.match(/(\d)+/)[0];
  size = size >= 8 ? 8 : Number(size);

  //ramdom 存在的情况下验证ramdom
  if (ramdom && !(/^(0|1|true|false)$/.test(ramdom))) {
    restResult.errorCode = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
    restResult.errorReason = 'ramdom字段为只接收0、1、true、false为参数！';
    res.send(restResult);
    return;
  }

  //ramdom 返回随机结果
  if (ramdom === '1' || ramdom === 'true') {

    BgModel.aggregate({
      $sample: {
        size: size
      }
    }).exec((err, data) => {
      if (err) {
        restResult.errorCode = RestResult.SERVER_EXCEPTION_ERROR_CODE;
        restResult.errorReason = err;
        res.send(restResult);
      } else {
        restResult.errorCode = RestResult.NO_ERROR;
        restResult.errorReason = '';
        restResult.returnValue = dataFilter(data);
        res.send(restResult);
      }
    });
    return;
  }

  // 处理只有size||ramdom为非随机的情况 返回正确数据
  BgModel.find().sort(sizeSort).limit(size).exec((err, data) => {
    if (err) {
      restResult.errorCode = RestResult.SERVER_EXCEPTION_ERROR_CODE;
      restResult.errorReason = err;
      res.send(restResult);
    } else {
      restResult.errorCode = RestResult.NO_ERROR;
      restResult.errorReason = '';
      restResult.returnValue = dataFilter(data);
      res.send(restResult);
    }
  });
  return;
});

//删除数据中不必要的字段
function dataFilter(data) {
  var arr = [];
  data.forEach((obj,index) =>{
    var newobj = {};
    newobj.index = index;
    newobj.url = obj.link;
    newobj.copyright = obj.copyright;
    arr.push(newobj);
  });

  return arr;
}


module.exports = router;