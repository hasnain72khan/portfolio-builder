import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, XCircle, AlertTriangle, Zap, Target, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Toast from '../components/Toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Smart keyword extraction ──────────────────────────────
const STOP = new Set('a an the and or but in on at to for of with by from is are was were be been being have has had do does did will would could should may might shall can need must it its this that these those i you he she we they me him her us them my your his our their what which who whom when where how not no nor as if then than too very just about above after again all also am any because before between both each few more most other over own same so some such through under until up while into during out only able etc per via using work working role team company position job looking join including well strong good great excellent required preferred responsibilities requirements qualifications benefits salary apply application candidate candidates opportunity opportunities environment ensure provide support develop maintain manage create build lead help make year years day days time new'.split(' '));

// Extract meaningful keywords + tech terms
function extractTerms(text) {
  if (!text) return new Map();
  const freq = new Map();
  // Preserve tech terms like C++, .NET, Node.js, etc.
  const cleaned = text.toLowerCase().replace(/['']/g, "'");

  // Extract multi-word tech phrases first (react native, machine learning, etc.)
  const techPhrases = cleaned.match(/\b(?:machine learning|deep learning|data science|full[- ]stack|front[- ]end|back[- ]end|react native|node\.?js|next\.?js|vue\.?js|angular\.?js|express\.?js|type ?script|java ?script|power ?bi|ci\/?cd|dev ?ops|cloud computing|project management|agile|scrum|rest ?api|graph ?ql|micro ?services|unit test|web development|mobile development|ui\/?ux|user experience|user interface|problem solving|communication skills|team ?work|leadership|sql server|no ?sql|mongo ?db|postgre ?sql|amazon web|google cloud|version control)\b/g) || [];
  techPhrases.forEach(p => {
    const norm = p.replace(/\s+/g, ' ').trim();
    freq.set(norm, (freq.get(norm) || 0) + 2); // weight phrases higher
  });

  // Single words
  const words = cleaned.replace(/[^a-z0-9\s\-\+\#\.]/g, ' ').split(/\s+/);
  words.forEach(w => {
    if (w.length < 2 || STOP.has(w)) return;
    // Skip pure numbers
    if (/^\d+$/.test(w)) return;
    freq.set(w, (freq.get(w) || 0) + 1);
  });
  return freq;
}

// Build searchable text from resume data
function buildResumeText(data) {
  const parts = [];
  const { about, skills, experience, education, services, projects } = data;
  if (about?.name) parts.push(about.name);
  if (about?.title) parts.push(about.title, about.title); // double-weight title
  if (about?.bio) parts.push(about.bio);
  (skills || []).forEach(s => { parts.push(s.name, s.name, s.category || ''); }); // double-weight skills
  (experience || []).forEach(e => { parts.push(e.title, e.title, e.company || '', e.description || '', e.location || ''); });
  (education || []).forEach(e => { parts.push(e.degree || '', e.institution || '', e.description || ''); });
  (services || []).forEach(s => { parts.push(s.title || '', s.description || ''); });
  (projects || []).forEach(p => { parts.push(p.title || '', p.description || '', (p.techStack || []).join(' ')); });
  return parts.join(' ').toLowerCase();
}

// ── Core analysis engine ──────────────────────────────────
function analyze(jobDesc, data) {
  const jdTerms = extractTerms(jobDesc);
  const resumeText = buildResumeText(data);
  const { about, skills, experience, education, services, projects } = data;

  // Sort JD terms by frequency, take top 50
  const sorted = [...jdTerms.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50);

  const matched = [], missing = [];
  sorted.forEach(([term, count]) => {
    (resumeText.includes(term) ? matched : missing).push({ term, count });
  });

  // ── Section-level analysis ──────────────────────────────
  const sections = [];

  // Contact completeness
  const contactFields = [
    { label: 'Full name', ok: !!about?.name },
    { label: 'Professional title', ok: !!about?.title },
    { label: 'Email address', ok: !!about?.email },
    { label: 'Phone number', ok: !!about?.phone },
    { label: 'City & country', ok: !!(about?.city && about?.country) },
    { label: 'LinkedIn profile', ok: !!about?.linkedin },
  ];
  const contactScore = Math.round(contactFields.filter(f => f.ok).length / contactFields.length * 100);
  sections.push({ name: 'Contact Info', score: contactScore, items: contactFields, icon: 'user' });

  // Summary
  const bioLen = (about?.bio || '').length;
  const summaryItems = [
    { label: 'Has professional summary', ok: bioLen > 0 },
    { label: 'Summary is 50+ characters', ok: bioLen >= 50 },
    { label: 'Summary is under 500 characters (concise)', ok: bioLen > 0 && bioLen <= 500 },
  ];
  const summaryScore = Math.round(summaryItems.filter(f => f.ok).length / summaryItems.length * 100);
  sections.push({ name: 'Professional Summary', score: summaryScore, items: summaryItems, icon: 'file' });

  // Experience
  const exps = experience || [];
  const expWithDesc = exps.filter(e => e.description && e.description.length > 20);
  const expItems = [
    { label: 'Has work experience', ok: exps.length > 0 },
    { label: 'Has 2+ positions', ok: exps.length >= 2 },
    { label: 'All positions have descriptions', ok: exps.length > 0 && expWithDesc.length === exps.length },
    { label: 'Descriptions are detailed (50+ chars)', ok: expWithDesc.length > 0 && expWithDesc.every(e => e.description.length >= 50) },
    { label: 'Includes date ranges', ok: exps.length > 0 && exps.every(e => e.startDate) },
  ];
  const expScore = Math.round(expItems.filter(f => f.ok).length / expItems.length * 100);
  sections.push({ name: 'Work Experience', score: expScore, items: expItems, icon: 'briefcase' });

  // Skills
  const sk = skills || [];
  const skillItems = [
    { label: 'Has skills listed', ok: sk.length > 0 },
    { label: 'Has 5+ skills', ok: sk.length >= 5 },
    { label: 'Has 10+ skills', ok: sk.length >= 10 },
    { label: 'Skills have proficiency levels', ok: sk.length > 0 && sk.every(s => s.level) },
  ];
  const skillScore = Math.round(skillItems.filter(f => f.ok).length / skillItems.length * 100);
  sections.push({ name: 'Skills', score: skillScore, items: skillItems, icon: 'code' });

  // Education
  const edu = education || [];
  const eduItems = [
    { label: 'Has education listed', ok: edu.length > 0 },
    { label: 'Includes institution name', ok: edu.length > 0 && edu.every(e => e.institution) },
    { label: 'Includes degree/certification', ok: edu.length > 0 && edu.every(e => e.degree) },
  ];
  const eduScore = Math.round(eduItems.filter(f => f.ok).length / eduItems.length * 100);
  sections.push({ name: 'Education', score: eduScore, items: eduItems, icon: 'graduation' });

  // ── Scoring ─────────────────────────────────────────────
  const keywordScore = sorted.length > 0 ? Math.round(matched.length / sorted.length * 100) : 0;
  const sectionAvg = Math.round(sections.reduce((s, sec) => s + sec.score, 0) / sections.length);
  const overall = Math.round(keywordScore * 0.55 + sectionAvg * 0.45);

  // ── Actionable tips ─────────────────────────────────────
  const tips = [];
  if (missing.length > 5) tips.push(`Add these high-priority keywords to your skills or bio: ${missing.slice(0, 5).map(m => m.term).join(', ')}`);
  if (!about?.bio) tips.push('Add a professional summary — most ATS systems look for this first.');
  if (bioLen > 500) tips.push('Shorten your summary to under 500 characters for better ATS parsing.');
  if (sk.length < 5) tips.push('Add more skills — aim for at least 10 relevant technical skills.');
  if (exps.length > 0 && expWithDesc.length < exps.length) tips.push('Add descriptions to all work experience entries with measurable achievements.');
  if (!about?.linkedin) tips.push('Add your LinkedIn URL — recruiters check this 87% of the time.');
  if ((projects || []).length === 0) tips.push('Add projects to showcase practical experience.');
  if (keywordScore >= 75 && sectionAvg >= 75) tips.push('Your resume is well-optimized. Fine-tune by mirroring exact phrases from the job description.');

  return { overall, keywordScore, sectionAvg, matched, missing, sections, tips, totalTerms: sorted.length };
}

// ── Component ─────────────────────────────────────────────
const AdminATS = () => {
  const [jobDesc, setJobDesc] = useState('');
  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  // Single API call to load all resume data
  useEffect(() => {
    if (!user?.username) { setLoading(false); return; }
    axios.get(`${API}/public/${user.username}`)
      .then(r => setData(r.data))
      .catch(() => showToast('Failed to load resume data', 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleAnalyze = useCallback(() => {
    if (!jobDesc.trim()) return showToast('Paste a job description first', 'error');
    if (!data) return showToast('Resume data not loaded yet', 'error');
    setAnalyzing(true);
    // Small delay for UI feedback
    setTimeout(() => {
      setResult(analyze(jobDesc, data));
      setAnalyzing(false);
    }, 300);
  }, [jobDesc, data]);

  const scoreColor = (s) => s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';
  const scoreLabel = (s) => s >= 85 ? 'Excellent' : s >= 75 ? 'Good' : s >= 50 ? 'Needs Work' : 'Poor';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f13' }}>
      <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#0f0f13' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8 animate-fade-in-up">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors text-sm">
            <ArrowLeft size={18} /> Back
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">ATS Resume Scanner</h2>
          <div className="w-16" />
        </div>

        {/* Input */}
        <div className="glass rounded-2xl p-5 mb-6 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-violet-400" />
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Paste Job Description</label>
          </div>
          <textarea rows={7} placeholder="Paste the full job posting here — title, requirements, qualifications, responsibilities..."
            className="w-full rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 outline-none text-sm resize-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            value={jobDesc} onChange={e => setJobDesc(e.target.value)} />
          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] text-slate-600">{jobDesc.length > 0 ? `${jobDesc.split(/\s+/).filter(Boolean).length} words` : 'Tip: Include the full job posting for best results'}</span>
            <button onClick={handleAnalyze} disabled={analyzing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              {analyzing ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Zap size={16} />}
              {analyzing ? 'Scanning...' : 'Scan Resume'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>

            {/* Score Ring Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'ATS Score', score: result.overall, sub: 'Overall compatibility' },
                { label: 'Keyword Match', score: result.keywordScore, sub: `${result.matched.length}/${result.totalTerms} terms found` },
                { label: 'Completeness', score: result.sectionAvg, sub: 'Resume sections' },
              ].map(c => (
                <div key={c.label} className="glass rounded-2xl p-5 text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{c.label}</p>
                  <div className="relative w-24 h-24 mx-auto mb-2">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                      <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="7" />
                      <circle cx="48" cy="48" r="40" fill="none" stroke={scoreColor(c.score)} strokeWidth="7"
                        strokeDasharray={`${c.score * 2.513} 251.3`} strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.8s ease' }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold" style={{ color: scoreColor(c.score) }}>{c.score}</span>
                      <span className="text-[9px] font-semibold" style={{ color: scoreColor(c.score) }}>{scoreLabel(c.score)}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600">{c.sub}</p>
                </div>
              ))}
            </div>

            {/* Tips */}
            {result.tips.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 flex items-center gap-2">
                  <TrendingUp size={14} /> Optimization Tips
                </h3>
                <div className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5"
                        style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>{i + 1}</span>
                      <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
                  <CheckCircle size={14} /> Found in Resume ({result.matched.length})
                </h3>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                  {result.matched.map(k => (
                    <span key={k.term} className="px-2 py-1 rounded-md text-[11px] font-medium"
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}>
                      {k.term}
                    </span>
                  ))}
                  {result.matched.length === 0 && <p className="text-xs text-slate-600">No matches found</p>}
                </div>
              </div>
              <div className="glass rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2">
                  <XCircle size={14} /> Missing Keywords ({result.missing.length})
                </h3>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                  {result.missing.map(k => (
                    <span key={k.term} className="px-2 py-1 rounded-md text-[11px] font-medium"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5' }}>
                      {k.term}
                    </span>
                  ))}
                  {result.missing.length === 0 && <p className="text-xs text-emerald-400">All keywords matched</p>}
                </div>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2">
                <AlertTriangle size={14} /> Section Breakdown
              </h3>
              <div className="space-y-4">
                {result.sections.map(sec => (
                  <div key={sec.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-slate-300">{sec.name}</span>
                      <span className="text-xs font-bold" style={{ color: scoreColor(sec.score) }}>{sec.score}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${sec.score}%`, background: scoreColor(sec.score) }} />
                    </div>
                    <div className="mt-2 space-y-1">
                      {sec.items.map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                          {item.ok
                            ? <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                            : <XCircle size={12} className="text-red-500 flex-shrink-0" />}
                          <span className="text-[11px]" style={{ color: item.ok ? '#64748b' : '#f87171' }}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminATS;
