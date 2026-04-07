const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { getExperience, createExperience, deleteExperience } = require('../controllers/experienceController');

router.get('/',       authJWT, getExperience);
router.post('/',      authJWT, createExperience);
router.delete('/:id', authJWT, deleteExperience);

module.exports = router;
