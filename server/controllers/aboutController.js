const About = require('../models/About');

exports.getAbout = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.json({});

    let about = await About.findOne({ userId }).lean();
    if (!about) {
      // Create default only on first access
      about = await About.create({ userId, name: req.user.name, email: req.user.email });
      about = about.toObject();
    }
    res.json(about);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateAbout = async (req, res) => {
  try {
    let about = await About.findOne({ userId: req.user._id });
    if (!about) {
      about = await About.create({ ...req.body, userId: req.user._id });
    } else {
      Object.assign(about, req.body);
      await about.save();
    }
    res.json(about);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
