var Promise = require('bluebird');
var fooVM = require('../viewModels').foo;

exports.render = async (ctx) => {
  try {
    var vm = await fooVM.create();
  } catch (e) {
    await ctx.render('error/page404');
    return;
  }

  await ctx.render('index', {
    ...vm
  });
};

exports.renderFoo = async (ctx) => {
  await ctx.render('foo', {
    title: 'Hello Koa 2!',
    foo:'this is a stringxxaa'
  });
};

function throwError() {
  return Promise.reject(new Error('abc'))
    .then(data => [null, data])
    .catch(err => [err]);
}

//使用[err, data]的方式捕获异常
exports.renderError = async (ctx) => {
  var err, data;

  [err, data] = await throwError();
  if(err) {
    return await ctx.render('error/page500');
  }

  await ctx.render('foo', {
    title: 'Hello Koa 2!',
    foo: data
  });
};

//使用try/catch捕获异常
exports.renderErrorWithCatch = async (ctx) => {
  try {
    await Promise.reject(new Error('abc'));
  } catch(e) {
    return await ctx.render('error/page404');
  }

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