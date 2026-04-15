const router = require('express').Router();
const translate = require('google-translate-api-x');

router.post('/', async (req, res) => {
  try {
    const { data, targetLang: rawLang } = req.body;
    if (!data || !rawLang || rawLang === 'en') return res.json(data);

    const langMap = { zh: 'zh-CN' };
    const targetLang = langMap[rawLang] || rawLang;
    const out = JSON.parse(JSON.stringify(data));

    // Collect all texts to translate with their paths
    const jobs = [];
    const addJob = (obj, key) => {
      if (obj?.[key] && obj[key].trim().length > 0) jobs.push({ obj, key, text: obj[key] });
    };

    if (out.about) { addJob(out.about, 'title'); addJob(out.about, 'bio'); }
    if (out.experience?.length) for (const e of out.experience) { addJob(e, 'title'); addJob(e, 'description'); }
    if (out.education?.length) for (const e of out.education) { addJob(e, 'degree'); addJob(e, 'description'); }
    if (out.services?.length) for (const s of out.services) { addJob(s, 'title'); addJob(s, 'description'); }

    if (jobs.length === 0) return res.json(out);

    // Run ALL translations in parallel
    const results = await Promise.allSettled(
      jobs.map(j => translate(j.text, { to: targetLang, forceBatch: false }))
    );

    // Apply results
    results.forEach((r, i) => {
      if (r.status === 'fulfilled' && r.value?.text) {
        jobs[i].obj[jobs[i].key] = r.value.text;
      }
    });

    res.json(out);
  } catch (err) {
    console.error('Translate error:', err.message);
    res.json(req.body.data);
  }
});

module.exports = router;
