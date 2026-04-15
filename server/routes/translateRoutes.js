const router = require('express').Router();
const translate = require('google-translate-api-x');

router.post('/', async (req, res) => {
  try {
    const { data, targetLang: rawLang } = req.body;
    if (!data || !rawLang || rawLang === 'en') return res.json(data);

    // Map language codes that need special handling
    const langMap = { zh: 'zh-CN' };
    const targetLang = langMap[rawLang] || rawLang;

    const out = JSON.parse(JSON.stringify(data));

    const t = async (text) => {
      if (!text || text.trim().length === 0) return text;
      try {
        const r = await translate(text, { to: targetLang, forceBatch: false });
        return r.text;
      } catch (e) {
        console.warn('Translate failed:', e.message?.slice(0, 80));
        return text;
      }
    };

    // Translate about
    if (out.about) {
      if (out.about.title) out.about.title = await t(out.about.title);
      if (out.about.bio) out.about.bio = await t(out.about.bio);
    }

    // Translate experience
    if (out.experience?.length) {
      for (const e of out.experience) {
        if (e.title) e.title = await t(e.title);
        if (e.description) e.description = await t(e.description);
      }
    }

    // Translate education
    if (out.education?.length) {
      for (const e of out.education) {
        if (e.degree) e.degree = await t(e.degree);
        if (e.description) e.description = await t(e.description);
      }
    }

    // Translate services
    if (out.services?.length) {
      for (const s of out.services) {
        if (s.title) s.title = await t(s.title);
        if (s.description) s.description = await t(s.description);
      }
    }

    console.log(`Translated ${targetLang}: about=${!!out.about?.title}, exp=${out.experience?.length || 0}, edu=${out.education?.length || 0}, svc=${out.services?.length || 0}`);
    res.json(out);
  } catch (err) {
    console.error('Translate route error:', err.message);
    res.json(req.body.data);
  }
});

module.exports = router;
