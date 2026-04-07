const express = require('express');
const router = express.Router();
const User        = require('../models/User');
const About       = require('../models/About');
const Project     = require('../models/Project');
const Skill       = require('../models/Skill');
const Service     = require('../models/Service');
const Experience  = require('../models/Experience');
const Education   = require('../models/Education');
const Testimonial = require('../models/Testimonial');

// GET /api/public/:username — returns full portfolio data for a user
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ message: 'Portfolio not found' });

    const [about, projects, skills, services, experience, education, testimonials] = await Promise.all([
      About.findOne({ userId: user._id }),
      Project.find({ userId: user._id }),
      Skill.find({ userId: user._id }),
      Service.find({ userId: user._id }).sort({ order: 1 }),
      Experience.find({ userId: user._id }).sort({ order: 1 }),
      Education.find({ userId: user._id }).sort({ order: 1 }),
      Testimonial.find({ userId: user._id }).sort({ order: 1 }),
    ]);

    res.json({ user, about: about || {}, projects, skills, services, experience, education, testimonials });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
