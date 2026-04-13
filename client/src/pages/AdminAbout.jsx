import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Upload } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const AdminAbout = () => {
  const [form, setForm] = useState({
    name: '', title: '', avatar: '', bio: '',
    location: '', city: '', country: '',
    email: '', phone: '', linkedin: '', github: '', resumeUrl: '',
    yearsExp: '', projectCount: '', techCount: '',
    openToWork: true,
    accentColor: '#7c3aed',
    template: 'sidebar',
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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/about', form);
      showToast('About info saved successfully.');
    } catch {
      showToast('Failed to save.', 'error');
    }
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const inputCls   = 'w-full rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 text-sm';
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const focusStyle = (e) => (e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.4)');
  const blurStyle  = (e) => (e.target.style.boxShadow = 'none');
  const set        = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

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
          <div className="w-16" />
        </div>

        <form onSubmit={handleSave} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '80ms' }}>

          {/* Identity */}
          <div className="glass rounded-2xl p-4 sm:p-6 space-y-4 overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Identity</h3>

            {/* Avatar preview + upload */}
            <div className="flex items-center gap-5 mb-2">
              <div
                className="w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center text-2xl font-extrabold text-white cursor-pointer relative group"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                onClick={() => fileRef.current?.click()}
              >
                {form.avatar
                  ? <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
                  : (form.name ? form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'HK')
                }
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                  <Upload size={18} className="text-white" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFile}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}
                >
                  <Upload size={15} /> Upload Photo
                </button>
                {form.avatar && (
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, avatar: '' }))}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <X size={12} /> Remove photo
                  </button>
                )}
                <p className="text-[11px] text-slate-600">JPG, PNG, WebP. Shows initials if empty.</p>
              </div>
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
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.accentColor || '#7c3aed'}
                  onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  style={{ background: 'transparent' }}
                />
                <span className="text-sm text-slate-400 font-mono">{form.accentColor || '#7c3aed'}</span>
                <div className="flex gap-2 ml-2">
                  {['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'].map(c => (
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
          </div>

          {/* Contact */}
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
            className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            <Save size={16} /> Save Changes
          </button>
        </form>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminAbout;
