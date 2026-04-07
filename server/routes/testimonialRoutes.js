const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { getTestimonials, createTestimonial, deleteTestimonial } = require('../controllers/testimonialController');

router.get('/',       authJWT, getTestimonials);
router.post('/',      authJWT, createTestimonial);
router.delete('/:id', authJWT, deleteTestimonial);

module.exports = router;
