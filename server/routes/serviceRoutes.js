const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { getServices, createService, deleteService } = require('../controllers/serviceController');

router.get('/',       authJWT, getServices);
router.post('/',      authJWT, createService);
router.delete('/:id', authJWT, deleteService);

module.exports = router;
