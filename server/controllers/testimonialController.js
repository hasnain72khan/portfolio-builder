const Testimonial = require('../models/Testimonial');

exports.getTestimonials = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;

    if (req.query.page) {
      const page  = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
      const skip  = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Testimonial.find({ userId }).sort({ order: 1 }).skip(skip).limit(limit),
        Testimonial.countDocuments({ userId }),
      ]);

      return res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
    }

    const items = await Testimonial.find({ userId }).sort({ order: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createTestimonial = async (req, res) => {
  try {
    const item = new Testimonial({ ...req.body, userId: req.user._id });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    await item.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const t = await Testimonial.findOne({ _id: req.params.id, userId: req.user._id });
    if (!t) return res.status(404).json({ message: 'Not found' });
    Object.assign(t, req.body);
    await t.save();
    res.json(t);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
