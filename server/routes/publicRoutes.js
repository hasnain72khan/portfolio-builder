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

// GET /api/public/:username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'Portfolio not found' });

    const uid = user._id;
    const [about, projects, skills, services, experience, education, testimonials] = await Promise.all([
      About.findOne({ userId: uid }).lean(),
      Project.find({ userId: uid }).lean(),
      Skill.find({ userId: uid }).lean(),
      Service.find({ userId: uid }).sort({ order: 1 }).lean(),
      Experience.find({ userId: uid }).sort({ order: 1 }).lean(),
      Education.find({ userId: uid }).sort({ order: 1 }).lean(),
      Testimonial.find({ userId: uid }).sort({ order: 1 }).lean(),
    ]);

    res.json({ user, about: about || {}, projects, skills, services, experience, education, testimonials });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
