import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login, user }         = useAuth();
  const navigate                = useNavigate();

  if (user) return <Navigate to="/admin" replace />;

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
      <div className="glass rounded-3xl p-8 w-full max-w-sm animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
            <LogIn size={24} className="text-violet-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-1">Welcome Back</h2>
        <p className="text-slate-500 text-sm text-center mb-6">Login to manage your portfolio</p>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
            <input required type="email" placeholder="you@email.com" className={inputCls} style={inputStyle}
              value={form.email} onFocus={focusStyle} onBlur={blurStyle} onChange={set('email')} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input required type={showPass ? 'text' : 'password'} placeholder="Your password" className={`${inputCls} pr-11`} style={inputStyle}
                value={form.password} onFocus={focusStyle} onBlur={blurStyle} onChange={set('password')}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(e)} />
              <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white mt-2 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-slate-500 hover:text-violet-400 text-xs transition-colors">
            Forgot password?
          </Link>
        </div>

        <p className="text-center text-slate-500 text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
