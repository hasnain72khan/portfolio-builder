const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name:         { type: String, default: '' },
  title:        { type: String, default: '' },
  avatar:       { type: String, default: '' }, // base64 or URL
  bio:          { type: String, default: '' },
  bio2:         { type: String, default: '' },
  location:     { type: String, default: '' },
  city:         { type: String, default: '' },
  country:      { type: String, default: '' },
  email:        { type: String, default: '' },
  phone:        { type: String, default: '' },
  linkedin:     { type: String, default: '' },
  github:       { type: String, default: '' },
  resumeUrl:    { type: String, default: '' },
  yearsExp:     { type: String, default: '3+' },
  projectCount: { type: String, default: '20+' },
  techCount:    { type: String, default: '10+' },
  openToWork:   { type: Boolean, default: true },
  accentColor:  { type: String, default: '#7c3aed' },
  template:     { type: String, default: 'sidebar', enum: ['sidebar', 'single-page', 'minimal'] },
});

module.exports = mongoose.model('About', AboutSchema);
