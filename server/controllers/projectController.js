const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;

    if (req.query.page) {
      const page  = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
      const skip  = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Project.find({ userId }).skip(skip).limit(limit),
        Project.countDocuments({ userId }),
      ]);

      return res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
    }

    const projects = await Project.find({ userId });
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createProject = async (req, res) => {
  try {
    const project = new Project({ ...req.body, userId: req.user._id });
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ message: 'Not found' });
    await project.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ message: 'Not found' });
    Object.assign(project, req.body);
    await project.save();
    res.json(project);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
