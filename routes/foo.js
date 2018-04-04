var router = require('koa-router')();
var ctrl = require('../controllers').foo;

router.get('/', ctrl.render);
router.get('/foo', ctrl.renderFoo);
router.get('/string', ctrl.getString);
router.get('/json', ctrl.getJson);
router.get('/error', ctrl.renderError);
router.get('/error/catch', ctrl.renderErrorWithCatch);

module.exports = router;
