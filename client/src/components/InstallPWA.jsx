import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

/**
 * PWA install prompt — shows a banner when the app can be installed.
 * Works on Chrome/Edge (Android + Desktop). iOS shows instructions.
 */
const InstallPWA = () => {
  const [prompt, setPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed or dismissed
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem('pwa-dismissed')) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    if (ios) {
      // Show iOS instructions after 3 seconds
      setTimeout(() => setShow(true), 3000);
    } else {
      // Listen for Chrome/Edge install prompt
      const handler = (e) => {
        e.preventDefault();
        setPrompt(e);
        setShow(true);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('pwa-dismissed', '1');
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[300] animate-slide-up sm:left-auto sm:right-6 sm:w-80">
      <div className="rounded-2xl p-4 shadow-2xl" style={{ background: '#16161e', border: '1px solid rgba(124,58,237,0.3)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
              <Download size={18} className="text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Install App</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isIOS ? 'Tap Share → Add to Home Screen' : 'Add PortfolioBuilder to your home screen'}
              </p>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-slate-600 hover:text-slate-400 flex-shrink-0 mt-0.5">
            <X size={16} />
          </button>
        </div>
        {!isIOS && (
          <button onClick={handleInstall}
            className="w-full mt-3 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            Install Now
          </button>
        )}
      </div>
    </div>
  );
};

export default InstallPWA;
