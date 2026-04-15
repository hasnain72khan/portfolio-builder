const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['view', 'resume_download', 'contact_click'], default: 'view' },
  section:   { type: String, default: '' },
  ip:        { type: String, default: '' },
  userAgent: { type: String, default: '' },
  referrer:  { type: String, default: '' },
}, { timestamps: true });

AnalyticsSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
