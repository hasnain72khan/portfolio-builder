import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Upload, FileUp } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';
import { compressImage } from '../utils/compressImage';
import { parseLinkedInText } from '../utils/parseLinkedInPDF';

const AdminAbout = () => {
  const [form, setForm] = useState({
    name: '', title: '', avatar: '', bio: '',
    location: '', city: '', country: '',
    email: '', phone: '', linkedin: '', github: '', resumeUrl: '',
    yearsExp: '', projectCount: '', techCount: '',
    openToWork: true,
    accentColor: '#7c3aed',
    template: 'sidebar',
    language: 'en',
    theme: 'default',
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);
  const navigate              = useNavigate();
  const fileRef               = useRef(null);
  const { user }              = useAuth();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!user) return;
    api.get('/about')
      .then(r => {
        const data = r.data || {};
        if (!data.name)  data.name  = user.name;
        if (!data.email) data.email = user.email;
        setForm(f => ({ ...f, ...data }));
        setLoading(false);
      })
      .catch(() => {
        // Even if API fails, pre-fill from user
        setForm(f => ({ ...f, name: user.name, email: user.email }));
        showToast('Failed to load about info.', 'error');
        setLoading(false);
      });
  }, [user]);

  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/about', form);
      showToast('About info saved successfully.');
      setTimeout(() => navigate('/admin'), 800);
    } catch {
      showToast('Failed to save.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const compressed = await compressImage(reader.result, 400, 0.75);
      setForm(f => ({ ...f, avatar: compressed }));
    };
    reader.readAsDataURL(file);
  };

  const inputCls   = 'w-full rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 text-sm';
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const focusStyle = (e) => (e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.4)');
  const blurStyle  = (e) => (e.target.style.boxShadow = 'none');
  const set        = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const [linkedinModal, setLinkedinModal] = useState(false);
  const [linkedinText, setLinkedinText] = useState('');

  const handleLinkedInImport = () => {
    if (!linkedinText.trim()) return showToast('Paste your LinkedIn profile text first', 'error');
    const parsed = parseLinkedInText(linkedinText);
    if (!parsed) return showToast('Could not parse the text. Make sure you copied your full LinkedIn profile.', 'error');

    setForm(f => ({
      ...f,
      name: parsed.name || f.name,
      title: parsed.title || f.title,
      bio: parsed.bio || f.bio,
      email: parsed.email || f.email,
      phone: parsed.phone || f.phone,
      linkedin: parsed.linkedin || f.linkedin,
      city: parsed.location ? parsed.location.split(',')[0]?.trim() : f.city,
      country: parsed.location ? parsed.location.split(',')[1]?.trim() : f.country,
    }));

    let count = 0;
    if (parsed.experience?.length) {
      parsed.experience.forEach(exp => api.post('/experience', exp).catch(() => {}));
      count += parsed.experience.length;
    }
    if (parsed.education?.length) {
      parsed.education.forEach(edu => api.post('/education', edu).catch(() => {}));
      count += parsed.education.length;
    }
    if (parsed.skills?.length) {
      parsed.skills.forEach(sk => api.post('/skills', sk).catch(() => {}));
      count += parsed.skills.length;
    }

    showToast(`Imported ${count} items from LinkedIn`);
    setLinkedinModal(false);
    setLinkedinText('');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f13' }}>
      <p className="text-slate-500 text-sm">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#0f0f13' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8 animate-fade-in-up">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors text-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">About Management</h2>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setLinkedinModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400 transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <FileUp size={14} /> Import LinkedIn
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '80ms' }}>

          {/* Identity */}
          <div className="glass rounded-2xl p-4 sm:p-6 space-y-4 overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Identity</h3>

            {/* Avatar preview + upload */}
            <div className="mb-2">
              <div
                className="w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center text-2xl font-extrabold text-white cursor-pointer relative group"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                onClick={() => fileRef.current?.click()}
              >
                {form.avatar
                  ? <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
                  : (form.name ? form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'HK')
                }
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-2xl gap-1">
                  {form.avatar
                    ? <X size={16} className="text-white" onClick={(e) => { e.stopPropagation(); setForm(f => ({ ...f, avatar: '' })); }} />
                    : <Upload size={16} className="text-white" />
                  }
                  <span className="text-[9px] text-white/80">{form.avatar ? 'Remove' : 'Upload'}</span>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
              <p className="text-[10px] text-slate-600 mt-1.5">Click photo to {form.avatar ? 'change or remove' : 'upload'}</p>
            </div>

            <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input type="text" placeholder="e.g. John Smith" className={inputCls} style={inputStyle}
                  value={form.name} onFocus={focusStyle} onBlur={blurStyle} onChange={set('name')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Role / Title</label>
                <input type="text" placeholder="e.g. Full-Stack Developer" className={inputCls} style={inputStyle}
                  value={form.title} onFocus={focusStyle} onBlur={blurStyle} onChange={set('title')} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Role Description</label>
              <textarea rows={4} placeholder="e.g. React & Shopify Developer" className={inputCls} style={inputStyle}
                value={form.bio} onFocus={focusStyle} onBlur={blurStyle} onChange={set('bio')} />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="openToWork"
                checked={form.openToWork}
                onChange={e => setForm(f => ({ ...f, openToWork: e.target.checked }))}
                className="w-4 h-4 accent-violet-500"
              />
              <label htmlFor="openToWork" className="text-sm text-slate-300">Show "Open to Work" badge</label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Accent Color</label>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="color"
                  value={form.accentColor || '#7c3aed'}
                  onChange={e => setForm(f => ({ ...f, accentColor: e.target.value, theme: 'default' }))}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  style={{ background: 'transparent' }}
                />
                <span className="text-sm text-slate-400 font-mono">{form.accentColor || '#7c3aed'}</span>
                <div className="flex gap-2 ml-2">
                  {['#7c3aed', '#3b82f6', '#10b981', '#f97316', '#ef4444', '#ec4899', '#a3e635'].map(c => (
                    <button key={c} type="button" onClick={() => setForm(f => ({ ...f, accentColor: c }))}
                      className="w-6 h-6 rounded-full transition-transform hover:scale-125"
                      style={{ background: c, border: form.accentColor === c ? '2px solid white' : '2px solid transparent' }} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Portfolio Template</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'sidebar',     label: 'Sidebar',     desc: 'Fixed sidebar + scrollable content' },
                  { id: 'single-page', label: 'Single Page', desc: 'Full-width sections, no sidebar' },
                  { id: 'minimal',     label: 'Minimal',     desc: 'Clean, centered, less is more' },
                ].map(t => (
                  <button key={t.id} type="button" onClick={() => setForm(f => ({ ...f, template: t.id }))}
                    className="p-3 rounded-xl text-left transition-all duration-200"
                    style={{
                      background: form.template === t.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${form.template === t.id ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    }}>
                    <p className="text-sm font-semibold" style={{ color: form.template === t.id ? '#a78bfa' : '#e2e8f0' }}>{t.label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Resume Language</label>
              <select
                className={inputCls}
                style={inputStyle}
                value={form.language || 'en'}
                onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                onFocus={focusStyle}
                onBlur={blurStyle}
              >
                <option value="en">English</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="pt">Portuguese (Português)</option>
                <option value="ar">Arabic (العربية)</option>
                <option value="zh">Chinese (中文)</option>
                <option value="ja">Japanese (日本語)</option>
                <option value="ko">Korean (한국어)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="ur">Urdu (اردو)</option>
                <option value="tr">Turkish (Türkçe)</option>
                <option value="ru">Russian (Русский)</option>
                <option value="it">Italian (Italiano)</option>
                <option value="nl">Dutch (Nederlands)</option>
              </select>
              <p className="text-[10px] text-slate-600 mt-1">Sets the language for resume section headings in both PDF and DOCX downloads.</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-4 sm:p-6 space-y-4 overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Contact Info</h3>
            <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">City</label>
                <input type="text" placeholder="City" className={inputCls} style={inputStyle}
                  value={form.city} onFocus={focusStyle} onBlur={blurStyle} onChange={set('city')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Country</label>
                <input type="text" placeholder="Country" className={inputCls} style={inputStyle}
                  value={form.country} onFocus={focusStyle} onBlur={blurStyle} onChange={set('country')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Location <span className="normal-case text-slate-600">(optional)</span></label>
                <input type="text" placeholder="e.g. Remote" className={inputCls} style={inputStyle}
                  value={form.location} onFocus={focusStyle} onBlur={blurStyle} onChange={set('location')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" placeholder="Email" className={inputCls} style={inputStyle}
                  value={form.email} onFocus={focusStyle} onBlur={blurStyle} onChange={set('email')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Phone</label>
                <input type="text" placeholder="+92 300 0000000" className={inputCls} style={inputStyle}
                  value={form.phone} onFocus={focusStyle} onBlur={blurStyle} onChange={set('phone')} />
              </div>
            </div>
          </div>

          {/* Social & Links */}
          <div className="glass rounded-2xl p-4 sm:p-6 space-y-4 overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Social & Links</h3>
            <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">LinkedIn Profile</label>
                <input type="text" placeholder="linkedin.com/in/hasnain-khan" className={inputCls} style={inputStyle}
                  value={form.linkedin} onFocus={focusStyle} onBlur={blurStyle} onChange={set('linkedin')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">GitHub Profile</label>
                <input type="text" placeholder="github.com/username" className={inputCls} style={inputStyle}
                  value={form.github} onFocus={focusStyle} onBlur={blurStyle} onChange={set('github')} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Resume URL <span className="normal-case text-slate-600">(optional)</span></label>
                <input type="text" placeholder="https://drive.google.com/..." className={inputCls} style={inputStyle}
                  value={form.resumeUrl} onFocus={focusStyle} onBlur={blurStyle} onChange={set('resumeUrl')} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="glass rounded-2xl p-4 sm:p-6 space-y-4 overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Years Exp.</label>
                <input type="text" placeholder="3+" className={inputCls} style={inputStyle}
                  value={form.yearsExp} onFocus={focusStyle} onBlur={blurStyle} onChange={set('yearsExp')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Projects</label>
                <input type="text" placeholder="20+" className={inputCls} style={inputStyle}
                  value={form.projectCount} onFocus={focusStyle} onBlur={blurStyle} onChange={set('projectCount')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Technologies</label>
                <input type="text" placeholder="10+" className={inputCls} style={inputStyle}
                  value={form.techCount} onFocus={focusStyle} onBlur={blurStyle} onChange={set('techCount')} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            {saving ? <Spinner size={20} color="#fff" /> : <><Save size={16} /> Save Changes</>}
          </button>
        </form>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* LinkedIn Import Modal */}
      {linkedinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setLinkedinModal(false)}>
          <div className="rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto animate-slide-up" style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-base font-bold text-white">Import from LinkedIn</h3>
              <p className="text-[11px] text-slate-500 mt-1">Go to your LinkedIn profile → click "More" → "Save to PDF" → open the PDF → Select All (Ctrl+A) → Copy (Ctrl+C) → Paste below</p>
            </div>
            <div className="p-5 space-y-4">
              <textarea
                rows={12}
                placeholder="Paste your LinkedIn profile text here..."
                className="w-full rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 outline-none text-sm resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                value={linkedinText}
                onChange={e => setLinkedinText(e.target.value)}
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setLinkedinModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-400 transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Cancel
                </button>
                <button type="button" onClick={handleLinkedInImport}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  Import Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAbout;
