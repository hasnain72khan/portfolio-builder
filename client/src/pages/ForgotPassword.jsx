import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail } from 'lucide-react';
import api from '../api';

const ForgotPassword = () => {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
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
        <div className="glass rounded-3xl p-8 w-full max-w-sm text-center animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <Mail size={24} className="text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-slate-400 text-sm mb-2">If an account exists with this email, we sent a reset link to:</p>
          <p className="text-violet-400 font-semibold text-sm mb-4">{email}</p>
          <p className="text-slate-600 text-xs">The link expires in 10 minutes.</p>
          <Link to="/login" className="block mt-6 text-violet-400 hover:text-violet-300 text-sm font-medium">
            Back to Login
          </Link>
        </div>
      ) : (
        <div className="glass rounded-3xl p-8 w-full max-w-sm animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <KeyRound size={24} className="text-violet-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-1">Forgot Password</h2>
          <p className="text-slate-500 text-sm text-center mb-6">Enter your email to receive a reset link</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input required type="email" placeholder="you@email.com" className={inputCls} style={inputStyle}
                value={email} onFocus={focusStyle} onBlur={blurStyle} onChange={e => setEmail(e.target.value)} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">Login</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
