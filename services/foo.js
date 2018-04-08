var Promise = require('bluebird');
var axios = require('axios');
var rp = require('request-promise');
var request = require('request');

exports.getById = async () => {
  var id = 'adx-adfdsf-asdfadf-xx';
  var name = 'zhang';

  //模拟异步请求
  return await Promise.resolve({id, name});
};

exports.getSomething = async () => {
  var list = [{id:111, fullName:'1234' }, {id:111, fullName:'xxxx' }];

  //模拟异步请求
  return await Promise.resolve({list});
};

exports.getSomethingx = async () => {
  return foo();
};

function foo() {
  var url = 'http://10.0.0.60:10080/api/authorization_code';

  return new Promise(function(resolve, reject) {
    request.get(url, function(err, res, body) {
      console.log('zzz',err, body, res.statusCode);
      if(err) {
        return reject(err);
      }

      resolve(body);
    });
  });
}
