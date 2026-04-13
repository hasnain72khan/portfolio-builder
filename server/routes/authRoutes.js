const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { register, login, getMe, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');

// Rate limit: 5 attempts per 15 minutes for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register',        authLimiter, register);
router.post('/verify',           verifyEmail);
router.post('/login',            authLimiter, login);
router.post('/forgot-password',  authLimiter, forgotPassword);
router.post('/reset-password',   authLimiter, resetPassword);
router.get('/me',                authJWT, getMe);

module.exports = router;
