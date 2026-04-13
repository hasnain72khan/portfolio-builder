const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail, sendResetEmail } = require('../utils/sendEmail');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register — does NOT save to DB, just sends verify link with data in token
exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    if (!/^[a-z0-9_-]+$/.test(username))
      return res.status(400).json({ message: 'Username can only contain lowercase letters, numbers, hyphens and underscores' });

    // Check if verified user already exists
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists && exists.verified)
      return res.status(400).json({ message: 'Email or username already taken' });

    // Hash password and embed all data in the token
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = jwt.sign(
      { name, username, email, password: hashedPassword, purpose: 'verify' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify?token=${verifyToken}`;
    await sendVerificationEmail(email, verifyUrl, name);

    res.status(200).json({
      message: 'Verification link sent to your email.',
      email,
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// Verify — creates user in DB only now
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== 'verify')
      return res.status(400).json({ message: 'Invalid token' });

    // Check if already registered
    const exists = await User.findOne({ $or: [{ email: decoded.email }, { username: decoded.username }] });
    if (exists && exists.verified)
      return res.status(400).json({ message: 'Account already exists. Please login.' });

    // Delete any unverified leftover
    if (exists && !exists.verified) await exists.deleteOne();

    // Create verified user now — password is already hashed in token
    const user = new User({
      name: decoded.name,
      username: decoded.username,
      email: decoded.email,
      password: decoded.password,
      verified: true,
    });
    // Skip the pre-save hash since password is already hashed
    user.$skipPasswordHash = true;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(400).json({ message: 'Link expired. Please register again.' });
    console.error('Verify error:', err.message);
    res.status(400).json({ message: 'Invalid or expired link' });
  }
};

// Login — only verified users
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.verified)
      return res.status(403).json({ message: 'Email not verified. Check your inbox.' });

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// Forgot password — sends reset link to email (10 min expiry)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    // Don't reveal if user exists or not
    if (!user || !user.verified) {
      return res.json({ message: 'If an account exists with this email, a reset link has been sent.' });
    }

    const resetToken = jwt.sign(
      { id: user._id, purpose: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    await sendResetEmail(email, resetUrl, user.name);
    console.log('Reset email sent to:', email);

    res.json({ message: 'If an account exists with this email, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// Reset password — verifies token and updates password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and password required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== 'reset')
      return res.status(400).json({ message: 'Invalid token' });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = password;
    user.$skipPasswordHash = false;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now login.' });
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(400).json({ message: 'Reset link expired. Please request a new one.' });
    res.status(400).json({ message: 'Invalid or expired link' });
  }
};
