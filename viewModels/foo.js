var Promise = require('bluebird');
var services = require('../services');

//装配页面所需的数据结构
var vm = {
  data:{
    user:{},
    something:{}
  },
  create: async () => {
    var user = await services.foo.getById();
    var something = await services.foo.getSomething();

    vm.data = {
      user,
      something
    }

    return vm.data;
  }
}

module.exports = vm;