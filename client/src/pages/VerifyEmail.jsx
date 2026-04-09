import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [searchParams]      = useSearchParams();
  const [status, setStatus] = useState('ready'); // 'ready' | 'loading' | 'success' | 'error'
  const [error, setError]   = useState('');
  const { login }           = useAuth();
  const navigate            = useNavigate();
  const token               = searchParams.get('token');

  const handleVerify = async () => {
    if (!token) {
      setStatus('error');
      setError('No verification token found.');
      return;
    }

    setStatus('loading');
    try {
      const res = await api.post('/auth/verify', { token });
      login(res.data);
      setStatus('success');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(124,58,237,0.18) 0%, transparent 70%), #0f0f13' }}
    >
      <div className="glass rounded-3xl p-8 w-full max-w-sm text-center animate-fade-in-up">

        {status === 'ready' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                <ShieldCheck size={24} className="text-violet-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-slate-500 text-sm mb-6">Click the button below to verify your email and create your account.</p>
            <button
              onClick={handleVerify}
              className="w-full py-3 rounded-xl font-bold text-white transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              Verify & Create Account
            </button>
          </>
        )}

        {status === 'loading' && (
          <>
            <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Verifying...</h2>
            <p className="text-slate-500 text-sm">Creating your account</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-slate-500 text-sm">Redirecting to your dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <AlertCircle size={24} className="text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
