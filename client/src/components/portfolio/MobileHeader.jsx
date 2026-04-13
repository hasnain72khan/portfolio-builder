import { Sun, Moon, Menu, X } from 'lucide-react';

const MobileHeader = ({ about, displayName, initials, isDark, setIsDark, mobileNav, onToggleNav }) => (
  <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3"
    style={{ background: 'var(--mobile-header-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-border)' }}>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center text-sm font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
        {about?.avatar
          ? <img src={about.avatar} alt={displayName} className="w-full h-full object-cover" />
          : initials}
      </div>
      <div>
        <p className="text-sm font-bold" style={{ color: 'var(--color-heading)' }}>{displayName}</p>
        {about?.title && <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">{about.title}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={() => setIsDark(d => !d)} className="p-2 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
        {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-violet-400" />}
      </button>
      <button onClick={onToggleNav} className="p-2 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
        {mobileNav ? <X size={18} style={{ color: 'var(--color-text)' }} /> : <Menu size={18} style={{ color: 'var(--color-text)' }} />}
      </button>
    </div>
  </header>
);

export default MobileHeader;
