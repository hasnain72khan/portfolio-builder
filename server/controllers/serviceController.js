const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;
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
