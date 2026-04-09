const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { register, login, getMe, verifyEmail } = require('../controllers/authController');

router.post('/register', register);
router.post('/verify',   verifyEmail);
router.post('/login',    login);
router.get('/me',        authJWT, getMe);

module.exports = router;
