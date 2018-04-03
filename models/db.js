var mongoose = require('mongoose');
// var config = require('../config');

mongoose.connect('mongodb://localhost/test');

mongoose.connection.on('connected', function () {    
  console.log('Mongoose connected success');  
});    

mongoose.connection.on('error',function (err) {    
  console.log(`Mongoose connection error: ${err.message}`);  
});    

mongoose.connection.on('disconnected', function () {    
  console.log('Mongoose connection disconnected');  
});

module.exports = mongoose;
