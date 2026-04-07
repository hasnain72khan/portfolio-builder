const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/skills',   require('./routes/skillRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/about',    require('./routes/aboutRoutes'));
app.use('/api/experience',   require('./routes/experienceRoutes'));
app.use('/api/education',    require('./routes/educationRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/public',       require('./routes/publicRoutes'));

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

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${name} — ${title}</title>
  <meta name="description" content="${bio.replace(/"/g, '&quot;').slice(0, 200)}" />
  <meta property="og:title" content="${name} — ${title}" />
  <meta property="og:description" content="${bio.replace(/"/g, '&quot;').slice(0, 200)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  ${avatar ? `<meta property="og:image" content="${avatar}" />` : ''}
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${name} — ${title}" />
  <meta name="twitter:description" content="${bio.replace(/"/g, '&quot;').slice(0, 200)}" />
  ${avatar ? `<meta name="twitter:image" content="${avatar}" />` : ''}
</head>
<body>
  <h1>${name}</h1>
  <p>${title}</p>
  <p>${bio.slice(0, 300)}</p>
</body>
</html>`);
  } catch {
    next();
  }
});

// ── Socket.io Chat ────────────────────────────────────────────
// Store messages in memory (resets on server restart)
const messages = [];

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Send existing messages to newly connected client
  socket.emit('history', messages);

  // Visitor sends a message
  socket.on('visitor:message', (data) => {
    const msg = {
      id: Date.now(),
      from: 'visitor',
      name: data.name || 'Visitor',
      text: data.text,
      time: new Date().toISOString(),
    };
    messages.push(msg);
    io.emit('new:message', msg); // broadcast to all (visitor + admin)
  });

  // Admin replies
  socket.on('admin:message', (data) => {
    const msg = {
      id: Date.now(),
      from: 'admin',
      name: 'Hasnain',
      text: data.text,
      time: new Date().toISOString(),
    };
    messages.push(msg);
    io.emit('new:message', msg); // broadcast to all
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
