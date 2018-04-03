var dev = require('./config.dev');
var prod = require('./config.prod');

var config = {
  port:'3000'
};

var xConfig = process.env.NODE_ENV === 'development' ? dev : prod;
var merge = { ...config, ...xConfig };

module.exports = merge;