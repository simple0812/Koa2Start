var path = require('path');
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
// const multer = require('koa-multer');
var compress = require('koa-compress');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
var favicon = require('koa-favicon');
var route = require('./routes');
var seoConfig = require('./config/seo');
var ejsLocals = require('ejs-locals');

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
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'ejs',
  engineSource: {ejs: engine }
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();

  await next();

  const ms = new Date() - start;

  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 添加seo信息(title, keyword, description)
app.use(async (ctx, next) => {
  var seo = seoConfig[ctx.request.url] || seoConfig.default;
  var xRender = ctx.render;

  ctx.render = async function(tmpl, data) {
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
