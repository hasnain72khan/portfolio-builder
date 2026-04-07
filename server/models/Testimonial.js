const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  role:    { type: String, default: '' },
  text:    { type: String, required: true },
  rating:  { type: Number, default: 5, min: 1, max: 5 },
  avatar:    { type: String, default: '' },
  source:    { type: String, default: '' },
  sourceUrl: { type: String, default: '' },
  order:     { type: Number, default: 0 },
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
