const Analytics = require('../models/Analytics');
const User = require('../models/User');

// Track a view (public, no auth)
exports.trackView = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'Not found' });

    await Analytics.create({
      userId: user._id,
      type: req.body.type || 'view',
      section: req.body.section || '',
      ip: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.headers['user-agent'] || '',
      referrer: req.headers.referer || '',
    });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get analytics summary (auth required)
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [totalViews, last30, last7, resumeDownloads, contactClicks, dailyViews] = await Promise.all([
      Analytics.countDocuments({ userId, type: 'view' }),
      Analytics.countDocuments({ userId, type: 'view', createdAt: { $gte: thirtyDaysAgo } }),
      Analytics.countDocuments({ userId, type: 'view', createdAt: { $gte: sevenDaysAgo } }),
      Analytics.countDocuments({ userId, type: 'resume_download' }),
      Analytics.countDocuments({ userId, type: 'contact_click' }),
      Analytics.aggregate([
        { $match: { userId, type: 'view', createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({ totalViews, last30, last7, resumeDownloads, contactClicks, dailyViews });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
