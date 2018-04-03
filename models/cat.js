var mongoose = require('mongoose');
var Cat = mongoose.model('Cat', { name: String });

module.exports = Cat;