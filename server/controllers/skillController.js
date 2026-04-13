const Skill = require('../models/Skill');

exports.getSkills = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;
    const page  = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip  = (page - 1) * limit;

    const [skills, total] = await Promise.all([
      Skill.find({ userId }).skip(skip).limit(limit),
      Skill.countDocuments({ userId }),
    ]);

    res.json({
      data: skills,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
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

exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ message: 'Not found' });
    Object.assign(skill, req.body);
    await skill.save();
    res.json(skill);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
