import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../api';

const ResetPassword = () => {
  const [searchParams]          = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus]     = useState('ready'); // ready | loading | success | error
  const [error, setError]       = useState('');
  const navigate                = useNavigate();
  const token                   = searchParams.get('token');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }

    setStatus('loading');
    try {
      await api.post('/auth/reset-password', { token, password });
      setStatus('success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  const inputCls = 'w-full rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-all duration-200 text-sm';
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const focusStyle = (e) => (e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.5)');
  const blurStyle  = (e) => (e.target.style.boxShadow = 'none');

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0f0f13' }}>
      <div className="glass rounded-3xl p-8 w-full max-w-sm text-center">
        <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Invalid Link</h2>
        <p className="text-slate-500 text-sm mb-4">No reset token found.</p>
        <Link to="/forgot-password" className="text-violet-400 hover:text-violet-300 text-sm font-medium">Request a new link</Link>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(124,58,237,0.18) 0%, transparent 70%), #0f0f13' }}
    >
      <div className="glass rounded-3xl p-8 w-full max-w-sm animate-fade-in-up">

        {status === 'success' ? (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Password Reset!</h2>
            <p className="text-slate-500 text-sm">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                <KeyRound size={24} className="text-violet-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-1">New Password</h2>
            <p className="text-slate-500 text-sm text-center mb-6">Enter your new password below</p>

            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <input required type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" className={`${inputCls} pr-11`} style={inputStyle}
                    value={password} onFocus={focusStyle} onBlur={blurStyle} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                <input required type="password" placeholder="Re-enter password" className={inputCls} style={inputStyle}
                  value={confirm} onFocus={focusStyle} onBlur={blurStyle} onChange={e => setConfirm(e.target.value)} />
              </div>

              <button type="submit" disabled={status === 'loading'}
                className="w-full py-3 rounded-xl font-bold text-white transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
