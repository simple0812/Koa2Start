var Promise = require('bluebird');
var axios = require('axios');
var common = require('../utils/common');

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
  var url = 'http://10.0.0.60:10080/api/authorization_code';

  return axios.get(url).then(res => common.resolveResponse(res));
};