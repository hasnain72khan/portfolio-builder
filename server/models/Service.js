const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  icon:        { type: String, default: 'Code2' }, // lucide icon name
  order:       { type: Number, default: 0 },
});

ServiceSchema.index({ userId: 1 });

module.exports = mongoose.model('Service', ServiceSchema);
