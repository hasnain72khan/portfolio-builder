const CoverLetter = require('../models/CoverLetter');

// GET all (with pagination)
exports.getAll = async (req, res) => {
  try {
    const query = { userId: req.user.id };
    if (req.query.page) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const total = await CoverLetter.countDocuments(query);
      const data = await CoverLetter.find(query).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit);
      return res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
    }
    const data = await CoverLetter.find(query).sort({ updatedAt: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET one
exports.getOne = async (req, res) => {
  try {
    const item = await CoverLetter.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const item = await CoverLetter.create({ ...req.body, userId: req.user.id });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const item = await CoverLetter.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    await CoverLetter.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
