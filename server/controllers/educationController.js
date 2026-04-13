const Education = require('../models/Education');

exports.getEducation = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;

    if (req.query.page) {
      const page  = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
      const skip  = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Education.find({ userId }).sort({ order: 1 }).skip(skip).limit(limit),
        Education.countDocuments({ userId }),
      ]);

      return res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
    }

    const items = await Education.find({ userId }).sort({ order: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createEducation = async (req, res) => {
  try {
    const item = new Education({ ...req.body, userId: req.user._id });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteEducation = async (req, res) => {
  try {
    const item = await Education.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    await item.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateEducation = async (req, res) => {
  try {
    const edu = await Education.findOne({ _id: req.params.id, userId: req.user._id });
    if (!edu) return res.status(404).json({ message: 'Not found' });
    Object.assign(edu, req.body);
    await edu.save();
    res.json(edu);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
