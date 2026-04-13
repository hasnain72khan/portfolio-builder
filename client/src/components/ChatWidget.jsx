import { useState } from 'react';
import { MessageCircle, X, Send, MessageSquare, Mail } from 'lucide-react';

const ChatWidget = ({ ownerName = '', ownerEmail = '', ownerPhone = '', ownerAvatar = '' }) => {
  const [open, setOpen]     = useState(false);
  const [name, setName]     = useState('');
  const [message, setMsg]   = useState('');
  const [sent, setSent]     = useState(false);

  // Clean phone: remove spaces, dashes, +, brackets
  const cleanPhone = ownerPhone.replace(/[\s\-\+\(\)]/g, '');

  const initials = ownerName
    ? ownerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const handleWhatsApp = () => {
    if (!message.trim() || !cleanPhone) return;
    const text = encodeURIComponent(
      `Hi ${ownerName || 'there'}! I'm ${name || 'a visitor'} from your portfolio.\n\n${message}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    setSent(true);
  };

  const handleEmail = () => {
    if (!message.trim() || !ownerEmail) return;
    const subject = encodeURIComponent(`Portfolio Contact from ${name || 'a visitor'}`);
    const body = encodeURIComponent(
      `Hi ${ownerName || 'there'},\n\nYou have a new message from your portfolio.\n\nFrom: ${name || 'Anonymous'}\n\nMessage:\n${message}`
    );
    window.open(`mailto:${ownerEmail}?subject=${subject}&body=${body}`, '_blank');
    setSent(true);
  };

  const reset = () => { setName(''); setMsg(''); setSent(false); };

  // Hide widget if no contact info at all
  if (!ownerEmail && !cleanPhone) return null;

  return (
    <>
      <button
        onClick={() => { setOpen(o => !o); if (sent) reset(); }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
        style={{ background: 'linear-gradient(135deg, var(--color-brand, #7c3aed), rgba(var(--brand-rgb, 124,58,237), 0.8))', boxShadow: '0 0 24px rgba(var(--brand-rgb, 124,58,237), 0.45)' }}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl overflow-hidden shadow-2xl animate-slide-up flex flex-col"
          style={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3"
            style={{ background: `linear-gradient(135deg, var(--color-brand, #7c3aed), rgba(var(--brand-rgb, 124,58,237), 0.8))` }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
              {ownerAvatar
                ? <img src={ownerAvatar} alt={ownerName} className="w-full h-full object-cover" />
                : initials}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{ownerName || 'Contact Me'}</p>
              <p className="text-violet-200 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Available for work
              </p>
            </div>
          </div>

          {sent ? (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <Send size={20} className="text-emerald-400" />
              </div>
              <p className="text-white font-semibold">Message sent!</p>
              <p className="text-slate-500 text-xs">{ownerName || 'They'} will get back to you soon.</p>
              <button onClick={reset} className="mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Send another message
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <p className="text-slate-400 text-xs">Send a message — choose how to reach {ownerName?.split(' ')[0] || 'me'}:</p>

              <input
                type="text"
                placeholder="Your name (optional)"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.4)')}
                onBlur={e => (e.target.style.boxShadow = 'none')}
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <textarea
                rows={4}
                placeholder="Write your message..."
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all duration-200 resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.4)')}
                onBlur={e => (e.target.style.boxShadow = 'none')}
                value={message}
                onChange={e => setMsg(e.target.value)}
              />

              <div className="flex gap-2 pt-1">
                {cleanPhone && (
                  <button
                    onClick={handleWhatsApp}
                    disabled={!message.trim()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-green-500/20 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}>
                    <MessageSquare size={15} /> WhatsApp
                  </button>
                )}
                {ownerEmail && (
                  <button
                    onClick={handleEmail}
                    disabled={!message.trim()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5"
                    style={{ background: `linear-gradient(135deg, var(--color-brand, #7c3aed), rgba(var(--brand-rgb, 124,58,237), 0.8))` }}>
                    <Mail size={15} /> Email
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
