var router = require('koa-router')();
var Promise = require('bluebird');
var responseHelper = require('../utils/responseHelper');
var common = require('../utils/common');
var ejs = require('ejs');
var fs = require('fs');

/*一些常用操作的示例 如获取参数、解析form表单、读写cookie等*/
router.prefix('/bar');

router.get('/', function (ctx) {
  ctx.body = {
    test:'x', 
    foo:1
  };
});

router.get('/async', async (ctx) => {
  await Promise.delay(10);
  
  ctx.body = {
    test:'x', 
    foo:1
  };
});

//支持正则表达式
router.get('/:foo/b(a+)', async (ctx) => {
  await Promise.delay(10);
  
  ctx.body = {
    test:'reg', 
    foo:ctx.params.foo
  };
});

//获取url 路径上的参数
router.get('/params/:id', function (ctx) {
  var id = ctx.params.id;

  ctx.body = {
    test:'params', 
    foo:id
  };
});

//获取url ?后面的参数
router.get('/query', function (ctx) {
  var id = ctx.query.id;

  ctx.body = {
    test:'queryx', 
    foo:id
  };
});

router.get('/cookie', (ctx) => {
  var name = ctx.cookies.get('name') || '';
  var id = ctx.cookies.get('id') || '';

  ctx.body = responseHelper.getSuccess({id, name});
});

//获取post body参数
router.post('/cookie', async (ctx) => {
  var user = ctx.request.body || {};

  if(!user.id || !user.name) {
    ctx.body = responseHelper.getError('参数错误');
    return;
  }

  ctx.cookies.set('name', user.name , { signed: true });
  ctx.cookies.set('id', user.id , { signed: true });
  ctx.body = responseHelper.getSuccess('set cookie success');
});

//解析form表单
router.post('/cookie/form', async (ctx) => {
  var ret = await common.parseForm(ctx.req).catch(err => err);

  console.log(ret);
  if(!ret.files || !ret.fields) {
    return responseHelper.getError('解析失败');
  }
  var user = ret.fields;

  if(!user.id || !user.name) {
    return ctx.body = responseHelper.getError('参数错误');
  }

  ctx.cookies.set('name', user.name , { signed: true });
  ctx.cookies.set('id', user.id , { signed: true });
  ctx.body = responseHelper.getSuccess('set cookie success');
});

router.get('/error', async (ctx) => {
  await Promise.reject(new Error('something error'));

  ctx.body = {
    test:'query', 
    foo:'bar'
  };
});

router.get('/render/error',async () => {
  // await Promise.reject(new Error('something error'));
  throw new Error('zzzz');
});

module.exports = router;
