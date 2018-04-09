var gulp = require('gulp');
var config = require('./config');
var isRunning = false;

// 调用 .create() 意味着你得到一个唯一的实例并允许您创建多个服务器或代理。 
//检查html中bs的监听文件是否加载，需要一定有一个<body>来注入代码
var browserSync = require('browser-sync').create(); 
var nodemon = require('gulp-nodemon');

// 定义一个任务，任务的名字，该任务所要执行的一些操作 
gulp.task('watch', function() { 
// 启动Browsersync服务。这将启动一个服务器，代理服务器（proxy）或静态服务器（server） 
  browserSync.init({ 
  // 设置监听的文件，以gulpfile.js所在的根目录为起点，如果不在根目录要加上路径，单个文件就用字符串，多个文件就用数组 
    files: ['*.html', 'css/*.css', 'js/*.js'], 
    // 启动静态服务器，默认监听3000端口，设置启动时打开的index.html的路径 
    server: { baseDir: './' }, 
    // 在不同浏览器上镜像点击、滚动和表单，即所有浏览器都会同步 
    ghostMode: { clicks: true, scroll: true }, 
    // 更改控制台日志前缀 
    logPrefix: 'learning browser-sync in gulp', 
    // 设置监听时打开的浏览器，下面的设置会同时打开chrome, firefox和IE 
    browser: ['chrome', 'firefox', 'iexplore'], 
    // 设置服务器监听的端口号 
    port: config.port 
  }); 
});

gulp.task('default', function() {
  nodemon({ 
    script: 'bin/www', 
    // 忽略部分对程序运行无影响的文件的改动，nodemon只监视js文件，可用ext项来扩展别的文件类型 
    ignore: ['gulpfile.js', 'node_modules/', 'public/**/*.*'], 
    env: { NODE_ENV: config.env } 
  }).on('start', function() { 
    if(isRunning) {
      browserSync.reload();
    } else {
      isRunning = true;
      browserSync.init({ 
        proxy: `http://localhost:${config.port}`, 
        files: ['public/**/*.*', 'views/**', 'routes/**'], 
        browser: ['chrome'], 
        port:8080 
      }, function() { 
        console.log('browser refreshed.'); 
      });
    }
  });
});


