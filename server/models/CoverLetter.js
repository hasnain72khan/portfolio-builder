const mongoose = require('mongoose');

const CoverLetterSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  company:     { type: String, default: '' },
  jobTitle:    { type: String, default: '' },
  content:     { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
});

CoverLetterSchema.pre('save', function () { this.updatedAt = Date.now(); });

module.exports = mongoose.model('CoverLetter', CoverLetterSchema);
