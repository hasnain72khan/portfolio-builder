const mongoose = require('mongoose');

const ResumeVersionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:      { type: String, required: true },
  template:  { type: String, default: 'classic' },
  format:    { type: String, default: 'pdf', enum: ['pdf', 'docx'] },
  language:  { type: String, default: 'en' },
  // Snapshot of data at save time
  snapshot:  {
    about:      { type: Object, default: {} },
    skills:     [{ type: Object }],
    experience: [{ type: Object }],
    education:  [{ type: Object }],
    services:   [{ type: Object }],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ResumeVersionSchema.pre('save', function () { this.updatedAt = Date.now(); });

module.exports = mongoose.model('ResumeVersion', ResumeVersionSchema);
