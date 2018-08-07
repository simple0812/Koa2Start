const params = require('./params');
const foo = require('./foo');


module.exports = function(app) {
  app.use(params.routes(), params.allowedMethods());
  app.use(foo.routes(), foo.allowedMethods());
};
