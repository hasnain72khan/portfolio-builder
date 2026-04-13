const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const { getTestimonials, createTestimonial, deleteTestimonial, updateTestimonial } = require('../controllers/testimonialController');

router.get('/',       authJWT, getTestimonials);
router.post('/',      authJWT, createTestimonial);
router.put('/:id',    authJWT, updateTestimonial);
router.delete('/:id', authJWT, deleteTestimonial);

module.exports = router;
