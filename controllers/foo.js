var Promise = require('bluebird');
var fooVM = require('../viewModels').foo;

//获取参数及参数验证
exports.render = async (ctx) => {
  var vm = await fooVM.create();

  await ctx.render('index', {
    title: 'Hello Koa 2!',
    ...vm
  });
};

exports.renderFoo = async (ctx) => {
  await ctx.render('foo', {
    title: 'Hello Koa 2!',
    foo:'this is a stringxxaa'
  });
};

exports.getString = async (ctx) => {
  await Promise.delay(10); //模拟异步操作
  ctx.body = 'this is a string';
};

exports.getJson = async (ctx) => {
  await Promise.delay(10); //模拟异步操作

  ctx.body = {
    foo:'test',
    bar:'baz'
  };
};