const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register — does NOT save to DB, just sends verify link with data in token
exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

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
