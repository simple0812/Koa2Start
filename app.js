var path = require('path');
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
// const multer = require('koa-multer');
var compress = require('koa-compress');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
var favicon = require('koa-favicon');
var route = require('./routes');
var seoConfig = require('./config/seo');
var ejsLocals = require('ejs-locals');
var filesize = require('filesize');
var log4js = require('log4js');
var logger = require('./config/logger');

log4js.configure(logger);

//使用ejs-locals作为模版引擎
function engine(file, options) {
  return new Promise((resolve, reject) => {
    options.settings = {
      ['view engine']:'ejs',
      views: path.join(__dirname, 'views')
    };
    ejsLocals(file, options, function(err, html) {
      if(err) {
        return reject(err);
      }

      resolve(html);
    });
  });
}

//连接数据库
// require('./models/db');

app.keys = ['koa', 'test'];

// error handler
onerror(app);

//上传图片
// app.use(route.post('/profile', upload.single('avatar')));
// app.use(upload.single());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cors());
app.use(compress({
  filter: function (contentType) {
    return /text/i.test(contentType);
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}));

app.use(helmet());

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'ejs',
  engineSource: {ejs: engine }
}));

// logger 使用pm2管理后 并不需要自定义记录logger文件
app.use(async (ctx, next) => {
  const start = new Date();

  await next();

  var ms = new Date() - start;
  var contentLength = ctx.res.getHeader('content-length') || 0;

  console.log(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms :${filesize(contentLength, {bits:true})}`);
});

// 添加seo信息(title, keyword, description)
app.use(async (ctx, next) => {
  var seo = seoConfig.default;
  var xRender = ctx.render;

  ctx.render = async function(tmpl, data) {
    if(ctx.matched && ctx.matched.length) {
      var xPath = ctx.matched[0].path;

      if(seoConfig[xPath]) {
        seo = seoConfig[xPath];
      }
    }

    await xRender(tmpl, {...data, seo});
  };

  await next();
});

// routes
route(app);

//404
app.use(async (ctx, next) => {
  await ctx.render('error/page404');
  next();
});

//服务端错误 error-handling
app.on('error', (err) => {
  console.log('server error->', err.message);
  // ctx.response.status = 500;
  // ctx.res.end(err.stack);

  // ctx.res.status(err.status || 500).send(err.message || '500 status');
});

module.exports = app;
