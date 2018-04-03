var router = require('koa-router')();
var ctrl = require('../controllers').foo;

router.get('/', ctrl.render);
router.get('/foo', ctrl.renderFoo);
router.get('/string', ctrl.getString);
router.get('/json', ctrl.getJson);

module.exports = router;
