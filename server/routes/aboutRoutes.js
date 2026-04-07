const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { getAbout, updateAbout } = require('../controllers/aboutController');

router.get('/',  authJWT, getAbout);
router.put('/',  authJWT, updateAbout);

module.exports = router;
