const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { trackView, getAnalytics } = require('../controllers/analyticsController');

router.post('/track/:username', trackView);
router.get('/summary', authJWT, getAnalytics);

module.exports = router;
