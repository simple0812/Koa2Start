var fs = require('fs');
var config = require('./index');

if (!fs.existsSync(config.LOG_DIR)) {
  fs.mkdirSync(config.LOG_DIR);
}

module.exports = {
  appenders:{
    app:{
      category: 'app',
      type: 'file',
      filename: config.LOG_DIR + '/app.log',
      maxLogSize: 500 * 1024 * 1024 //500MB
    },
    out: { 
      type: 'stdout' 
    }
  },
  categories: { 
    default: { 
      appenders: ['app', 'out'], 
      //trace debug info warn error fatal mark
      level: 'error' 
    } 
  },
  pm2: true
};