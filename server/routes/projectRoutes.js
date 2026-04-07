const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { getProjects, createProject, deleteProject } = require('../controllers/projectController');

router.get('/',     authJWT, getProjects);
router.post('/',    authJWT, createProject);
router.delete('/:id', authJWT, deleteProject);

module.exports = router;
