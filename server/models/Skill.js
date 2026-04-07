const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:     { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Intermediate' }
});

module.exports = mongoose.model('Skill', SkillSchema);