const bar = require('./bar');
const foo = require('./foo');


module.exports = function(app) {
  app.use(bar.routes(), bar.allowedMethods());
  app.use(foo.routes(), foo.allowedMethods());
};