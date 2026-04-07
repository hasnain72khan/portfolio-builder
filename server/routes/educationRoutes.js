const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { getEducation, createEducation, deleteEducation } = require('../controllers/educationController');

router.get('/',       authJWT, getEducation);
router.post('/',      authJWT, createEducation);
router.delete('/:id', authJWT, deleteEducation);

module.exports = router;
