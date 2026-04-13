const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { getServices, createService, deleteService, updateService } = require('../controllers/serviceController');

router.get('/',       authJWT, getServices);
router.post('/',      authJWT, createService);
router.put('/:id',    authJWT, updateService);
router.delete('/:id', authJWT, deleteService);

module.exports = router;
