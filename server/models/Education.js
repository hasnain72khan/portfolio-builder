const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  degree:      { type: String, required: true },
  institution: { type: String, required: true },
  startDate:   { type: String, default: '' },
  endDate:     { type: String, default: '' },
  description: { type: String, default: '' },
  order:       { type: Number, default: 0 },
});

EducationSchema.index({ userId: 1 });

module.exports = mongoose.model('Education', EducationSchema);
