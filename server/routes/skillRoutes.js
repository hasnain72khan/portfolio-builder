const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { getSkills, createSkill, deleteSkill } = require('../controllers/skillController');

router.get('/',       authJWT, getSkills);
router.post('/',      authJWT, createSkill);
router.delete('/:id', authJWT, deleteSkill);

module.exports = router;
