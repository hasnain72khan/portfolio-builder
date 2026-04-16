const User = require('../models/User');
const About = require('../models/About');
const Analytics = require('../models/Analytics');
const { sendAnalyticsDigest } = require('./sendEmail');

/**
 * Send weekly analytics digest to all users who have analytics data.
 * Call this from a cron job or scheduled task.
 */
async function sendWeeklyDigests() {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const users = await User.find({}).lean();

    for (const user of users) {
      try {
        const about = await About.findOne({ userId: user._id }).lean();
        if (!about?.email && !user.email) continue;

        // Get analytics for the past week
        const analytics = await Analytics.find({
          userId: user._id,
          createdAt: { $gte: oneWeekAgo },
        }).lean();

        if (analytics.length === 0) continue;

        const views = analytics.filter(a => a.type === 'view').length;
        const downloads = analytics.filter(a => a.type === 'resume_download').length;
        const contacts = analytics.filter(a => a.type === 'contact_click').length;

        if (views === 0 && downloads === 0 && contacts === 0) continue;

        // Find best day
        const dayMap = {};
        analytics.filter(a => a.type === 'view').forEach(a => {
          const day = new Date(a.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          dayMap[day] = (dayMap[day] || 0) + 1;
        });
        const topDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0];

        const now = new Date();
        const period = `${oneWeekAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

        await sendAnalyticsDigest(
          about?.email || user.email,
          about?.name || user.name,
          {
            views,
            downloads,
            contacts,
            topDay: topDay ? { date: topDay[0], count: topDay[1] } : null,
            period,
          }
        );

        console.log(`📧 Digest sent to ${user.email}`);
      } catch (err) {
        console.warn(`Failed digest for ${user.email}:`, err.message);
      }
    }

    console.log('✅ Weekly digests complete');
  } catch (err) {
    console.error('Weekly digest error:', err.message);
  }
}

module.exports = { sendWeeklyDigests };
