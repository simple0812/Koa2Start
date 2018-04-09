var dev = require('./config.dev');
var prod = require('./config.prod');
var path = require('path');
var env = process.env.NODE_ENV || 'development';

var config = {
  env:env,
  LOG_DIR: path.resolve('.', 'logs'),
  port:'3000'
};

var xConfig = env ? dev : prod;
var merge = { ...config, ...xConfig };

module.exports = merge;