const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { getSkills, createSkill, deleteSkill, updateSkill } = require('../controllers/skillController');

router.get('/',       authJWT, getSkills);
router.post('/',      authJWT, createSkill);
router.put('/:id',    authJWT, updateSkill);
router.delete('/:id', authJWT, deleteSkill);

module.exports = router;
