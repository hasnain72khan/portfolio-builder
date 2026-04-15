const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, default: '' },
  startDate:   { type: String, required: true },
  endDate:     { type: String, default: 'Present' },
  description: { type: String, default: '' },
  order:       { type: Number, default: 0 },
});

ExperienceSchema.index({ userId: 1 });

module.exports = mongoose.model('Experience', ExperienceSchema);
