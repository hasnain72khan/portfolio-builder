import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Mail } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { user }                = useAuth();
  const [form, setForm]         = useState({ name: '', username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  if (user) return <Navigate to="/admin" replace />;

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      setSentEmail(res.data.email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-all duration-200 text-sm';
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const focusStyle = (e) => (e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.5)');
  const blurStyle  = (e) => (e.target.style.boxShadow = 'none');

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(124,58,237,0.18) 0%, transparent 70%), #0f0f13' }}
    >
      {sent ? (
        /* ── Check Email Screen ── */
        <div className="glass rounded-3xl p-8 w-full max-w-sm text-center animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <Mail size={24} className="text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-slate-400 text-sm mb-2">
            We sent a verification link to
          </p>
          <p className="text-violet-400 font-semibold text-sm mb-6">{sentEmail}</p>
          <p className="text-slate-500 text-xs">
            Click the "Verify My Email" button in the email to activate your account and go to your dashboard.
          </p>
          <p className="text-slate-600 text-xs mt-4">
            Didn't get it? Check your spam folder.
          </p>
        </div>
      ) : (
        /* ── Registration Form ── */
        <div className="glass rounded-3xl p-8 w-full max-w-md animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <UserPlus size={24} className="text-violet-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-1">Create Portfolio</h2>
          <p className="text-slate-500 text-sm text-center mb-6">Register to build your portfolio</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg text-sm text-red-400 animate-fade-in" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <input required type="text" placeholder="e.g. John Smith" className={inputCls} style={inputStyle}
                value={form.name} onFocus={focusStyle} onBlur={blurStyle} onChange={set('name')} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Username</label>
              <div className="flex items-center rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="px-3 py-3 text-xs text-slate-600 border-r" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>portfolio/</span>
                <input required type="text" placeholder="john-smith" className="flex-1 px-3 py-3 text-white placeholder:text-slate-600 outline-none text-sm bg-transparent"
                  onFocus={focusStyle} onBlur={blurStyle} value={form.username} onChange={set('username')} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input required type="email" placeholder="you@email.com" className={inputCls} style={inputStyle}
                value={form.email} onFocus={focusStyle} onBlur={blurStyle} onChange={set('email')} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input required type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" className={`${inputCls} pr-11`} style={inputStyle}
                  value={form.password} onFocus={focusStyle} onBlur={blurStyle} onChange={set('password')} />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white mt-2 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              {loading ? 'Creating...' : 'Create Portfolio'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">Login</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Register;
