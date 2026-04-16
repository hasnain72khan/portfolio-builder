const router = require('express').Router();
const { createCanvas } = require('canvas');
const User = require('../models/User');
const About = require('../models/About');

// GET /api/og/:username — generates a dynamic OG image (1200x630)
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).lean();
    if (!user) return res.status(404).send('Not found');

    const about = await About.findOne({ userId: user._id }).lean();
    const name = about?.name || user.name || req.params.username;
    const title = about?.title || 'Portfolio';
    const bio = (about?.bio || '').slice(0, 120);
    const accent = about?.accentColor || '#7c3aed';
    const location = about?.city && about?.country ? `${about.city}, ${about.country}` : '';

    // Create 1200x630 canvas (standard OG image size)
    const w = 1200, h = 630;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0b0b0f');
    grad.addColorStop(1, '#111118');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Accent bar on left
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 6, h);

    // Accent glow circle
    const glowGrad = ctx.createRadialGradient(900, 200, 0, 900, 200, 400);
    glowGrad.addColorStop(0, accent + '20');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(500, 0, 700, h);

    // Initials circle
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    ctx.beginPath();
    ctx.arc(160, h / 2 - 20, 80, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();

    ctx.font = 'bold 52px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 160, h / 2 - 20);

    // Name
    ctx.textAlign = 'left';
    ctx.font = 'bold 56px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(name, 300, 220);

    // Title
    ctx.font = '28px sans-serif';
    ctx.fillStyle = accent;
    ctx.fillText(title, 300, 275);

    // Bio (truncated)
    if (bio) {
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#94a3b8';
      // Word wrap
      const words = bio.split(' ');
      let line = '', ly = 330;
      for (const word of words) {
        const test = line + word + ' ';
        if (ctx.measureText(test).width > 750 && line) {
          ctx.fillText(line.trim(), 300, ly);
          line = word + ' ';
          ly += 30;
          if (ly > 390) break;
        } else {
          line = test;
        }
      }
      if (line && ly <= 390) ctx.fillText(line.trim(), 300, ly);
    }

    // Location
    if (location) {
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('📍 ' + location, 300, 440);
    }

    // Bottom bar
    ctx.fillStyle = accent + '30';
    ctx.fillRect(0, h - 60, w, 60);
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('portfolio-builder-theta-lake.vercel.app', w / 2, h - 25);

    // Send as PNG
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=86400'); // cache 24h
    canvas.createPNGStream().pipe(res);
  } catch (err) {
    console.error('OG image error:', err);
    res.status(500).send('Error generating image');
  }
});

module.exports = router;
