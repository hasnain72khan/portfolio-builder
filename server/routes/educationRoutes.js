const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { getEducation, createEducation, deleteEducation, updateEducation } = require('../controllers/educationController');

router.get('/',       authJWT, getEducation);
router.post('/',      authJWT, createEducation);
router.put('/:id',    authJWT, updateEducation);
router.delete('/:id', authJWT, deleteEducation);

module.exports = router;
