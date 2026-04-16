const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const { sendWeeklyDigests } = require('./utils/weeklyDigest');

const app = express();

// Connect to Database
connectDB();

// Weekly digest scheduler — runs every Monday at 9 AM
const scheduleWeeklyDigest = () => {
  const check = () => {
    const now = new Date();
    if (now.getDay() === 1 && now.getHours() === 9 && now.getMinutes() === 0) {
      sendWeeklyDigests().catch(err => console.error('Digest cron error:', err));
    }
  };
  setInterval(check, 60000); // check every minute
};
scheduleWeeklyDigest();

// Middleware
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(s => s.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) return cb(null, true);
    cb(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check / warm-up endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Manual digest trigger (for testing)
app.post('/api/admin/send-digests', async (req, res) => {
  try {
    await sendWeeklyDigests();
    res.json({ message: 'Digests sent' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Routes
app.use('/api/auth',            require('./routes/authRoutes'));
app.use('/api/projects',        require('./routes/projectRoutes'));
app.use('/api/skills',          require('./routes/skillRoutes'));
app.use('/api/services',        require('./routes/serviceRoutes'));
app.use('/api/about',           require('./routes/aboutRoutes'));
app.use('/api/experience',      require('./routes/experienceRoutes'));
app.use('/api/education',       require('./routes/educationRoutes'));
app.use('/api/testimonials',    require('./routes/testimonialRoutes'));
app.use('/api/public',          require('./routes/publicRoutes'));
app.use('/api/analytics',       require('./routes/analyticsRoutes'));
app.use('/api/cover-letters',   require('./routes/coverLetterRoutes'));
app.use('/api/resume-versions', require('./routes/resumeVersionRoutes'));
app.use('/api/qr',              require('./routes/qrRoutes'));
app.use('/api/translate',       require('./routes/translateRoutes'));
app.use('/sitemap.xml',         require('./routes/sitemapRoutes'));
app.use('/api/og',              require('./routes/ogImageRoutes'));

// robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.CLIENT_URL?.split(',')[0]?.trim() || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml`);
});

// ── OG Meta Tags for Social Crawlers ──────────────────────────
const User  = require('./models/User');
const About = require('./models/About');

app.get('/portfolio/:username', async (req, res, next) => {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const isCrawler = /facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegrambot|pinterest|discordbot/i.test(ua);
  if (!isCrawler) return next();

  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return next();
    const about = await About.findOne({ userId: user._id });
    const name = about?.name || user.name || req.params.username;
    const title = about?.title || 'Portfolio';
    const bio = about?.bio || `${name}'s professional portfolio`;
    const avatar = about?.avatar || '';
    const url = `${req.protocol}://${req.get('host')}/portfolio/${req.params.username}`;

    const bioSafe = bio.replace(/"/g, '&quot;').replace(/\\/g, '\\\\').slice(0, 200);
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name,
        jobTitle: title,
        description: bio.slice(0, 300),
        url,
        ...(avatar ? { image: avatar } : {}),
        ...(about?.email ? { email: about.email } : {}),
        ...(about?.city && about?.country ? { address: { '@type': 'PostalAddress', addressLocality: about.city, addressCountry: about.country } } : {}),
        ...(about?.linkedin ? { sameAs: [about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`] } : {}),
      }
    });

    const ogImage = `${req.protocol}://${req.get('host')}/api/og/${req.params.username}`;

    res.send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/>
<title>${name} — ${title}</title>
<meta name="description" content="${bioSafe}"/>
<meta property="og:title" content="${name} — ${title}"/>
<meta property="og:description" content="${bioSafe}"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="${url}"/>
<meta property="og:image" content="${ogImage}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${name} — ${title}"/>
<meta name="twitter:description" content="${bioSafe}"/>
<meta name="twitter:image" content="${ogImage}"/>
<script type="application/ld+json">${jsonLd}</script>
</head><body><h1>${name}</h1><p>${title}</p></body></html>`);
  } catch { next(); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
