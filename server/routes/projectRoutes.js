const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { getProjects, createProject, deleteProject, updateProject } = require('../controllers/projectController');

router.get('/',       authJWT, getProjects);
router.post('/',      authJWT, createProject);
router.put('/:id',    authJWT, updateProject);
router.delete('/:id', authJWT, deleteProject);

module.exports = router;
