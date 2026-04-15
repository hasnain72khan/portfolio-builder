const router = require('express').Router();
const auth = require('../middleware/authJWT');
const ctrl = require('../controllers/coverLetterController');

router.get('/',        auth, ctrl.getAll);
router.get('/:id',     auth, ctrl.getOne);
router.post('/',       auth, ctrl.create);
router.put('/:id',     auth, ctrl.update);
router.delete('/:id',  auth, ctrl.remove);

module.exports = router;
