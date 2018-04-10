const path = require('path');
const Koa = require('koa');
const http = require('http');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
// const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
// const multer = require('koa-multer');
const compress = require('koa-compress');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const fs = require('fs');

var favicon = require('koa-favicon');
var route = require('./routes');
var seoConfig = require('./config/seo');
var ejsLocals = require('ejs-locals');
var ejs = require('ejs');
var filesize = require('filesize');
var moment = require('moment');
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
// onerror(app);
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

// logger
app.use(async (ctx, next) => {
  const start = new Date();

  await next();

  var ms = new Date() - start;
  var contentLength = ctx.res.getHeader('content-length') || 0;

  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}] ${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms :${filesize(contentLength, {bits:true})}`);
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
app.on('error', (err, ctx) => {
  log4js.getLogger().error(`app error ${ctx.request.url}-> ${err.message}`);
});

app.context.onerror = function(err) {
  if(!err) {
    return;
  }

  if (err.code === 'ENOENT') {
    err.status = 404;
  }

  if (typeof err.status !== 'number' || !http.STATUS_CODES[err.status]) {
    err.status = 500;
  }

  this.app.emit('error', err, this);

  this.response.status = err.status;

  var errFile = 'views/error/error.ejs';
  var env = process.env.NODE_ENV || 'development';

  if(env !== 'development') {
    if(err.status === 404) {
      errFile = 'views/error/page404.ejs';
    } else if(err.status === 500) {
      errFile = 'views/error/page500.ejs';
    }
  }

  var template = fs.readFileSync(path.join(__dirname, errFile), 'utf-8');

  err.status = err.status;
  var html = ejs.render(template, err);

  this.res.status = err.status;
  this.res.setHeader('content-type','text/html; charset=utf-8');
  this.res.end(html);
};

module.exports = app;
