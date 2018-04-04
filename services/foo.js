var Promise = require('bluebird');
var axios = require('axios');

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
