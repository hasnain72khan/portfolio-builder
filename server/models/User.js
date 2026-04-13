const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  username:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  email:          { type: String, required: true, unique: true, lowercase: true },
  password:       { type: String, required: true },
  verified:       { type: Boolean, default: false },
  verifyToken:    { type: String },
  verifyExpires:  { type: Date },
}, { timestamps: true });

// Indexes for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

// Hash password before save
UserSchema.pre('save', async function () {
  if (!this.isModified('password') || this.$skipPasswordHash) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
UserSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', UserSchema);
