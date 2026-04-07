const Skill = require('../models/Skill');

exports.getSkills = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;
    const skills = await Skill.find({ userId });
    res.json(skills);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createSkill = async (req, res) => {
  try {
    const skill = new Skill({ ...req.body, userId: req.user._id });
    const saved = await skill.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ message: 'Not found' });
    await skill.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
