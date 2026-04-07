const Experience = require('../models/Experience');

exports.getExperience = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;
    const items = await Experience.find({ userId }).sort({ order: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createExperience = async (req, res) => {
  try {
    const item = new Experience({ ...req.body, userId: req.user._id });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteExperience = async (req, res) => {
  try {
    const item = await Experience.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    await item.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
