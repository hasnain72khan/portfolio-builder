const router = require('express').Router();
const QRCode = require('qrcode');

// GET /api/qr?text=... — returns QR code as base64 data URL
router.get('/', async (req, res) => {
  try {
    const text = req.query.text;
    if (!text) return res.status(400).json({ error: 'text query param required' });
    const dataUrl = await QRCode.toDataURL(text, { width: 400, margin: 2, errorCorrectionLevel: 'M' });
    res.json({ dataUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
