const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;

    if (req.query.page) {
      const page  = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
      const skip  = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Service.find({ userId }).sort({ order: 1 }).skip(skip).limit(limit),
        Service.countDocuments({ userId }),
      ]);

      return res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
    }

    const services = await Service.find({ userId }).sort({ order: 1 });
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createService = async (req, res) => {
  try {
    const service = new Service({ ...req.body, userId: req.user._id });
    const saved = await service.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, userId: req.user._id });
    if (!service) return res.status(404).json({ message: 'Not found' });
    await service.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, userId: req.user._id });
    if (!service) return res.status(404).json({ message: 'Not found' });
    Object.assign(service, req.body);
    await service.save();
    res.json(service);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
