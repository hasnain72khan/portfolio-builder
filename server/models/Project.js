const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  pageType:    { type: String, default: '' },
  description: String,
  image:       String,
  techStack:   [String],
  liveLink: String,
  githubLink: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);