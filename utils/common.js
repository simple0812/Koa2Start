var formidable = require('formidable');
var log4js = require('log4js');
var Promise = require('bluebird');

exports.resolveResponse = function(res) {
  console.log(res.config.url)
  var resData = res.data;

  if(!resData || resData.code !== '0' || !resData.data) {
    var msg = resData.message || '服务端返回数据格式不正确';

    log4js.getLogger().error(`获取接口数据错误${res.config.url}->${msg}`);
    return Promise.reject(new Error(msg));
  }

  return resData.data;
};

exports.parseForm = function(req) {
  return new Promise((resolve, reject) => {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
      if(err){
        reject(err);
        return;
      }

      resolve({fields, files});
    });
  });
};