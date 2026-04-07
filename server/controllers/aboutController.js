const About = require('../models/About');

exports.getAbout = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;
    let about = await About.findOne({ userId });
    if (!about && req.user) {
      about = await About.create({ userId: req.user._id, name: req.user.name, email: req.user.email });
    } else if (about && req.user) {
      let changed = false;
      if (!about.name)  { about.name  = req.user.name;  changed = true; }
      if (!about.email) { about.email = req.user.email; changed = true; }
      if (changed) await about.save();
    }
    // Strip legacy default values
    if (about && about.title === 'Full-Stack Developer') {
      about.title = '';
      await about.save();
    }
    res.json(about || {});
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
    console.error('About update error:', err.message);
    res.status(400).json({ message: err.message });
  }
};
