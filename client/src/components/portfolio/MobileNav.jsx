import { Download } from 'lucide-react';
import ShareButton from '../ShareButton';

const MobileNav = ({ mobileNav, mobileNavClosing, active, scrollTo, onResumeClick, displayName, about, NAV }) => {
  if (!mobileNav) return null;

  return (
    <div className={`lg:hidden fixed inset-0 z-40 pt-16 ${mobileNavClosing ? 'animate-slide-up-out' : 'animate-slide-down'}`}
      style={{ background: 'var(--mobile-header-bg)', backdropFilter: 'blur(16px)' }}>
      <nav className="px-6 py-4 space-y-1">
        {NAV.map(({ id, label, icon: Icon }, i) => (
          <button key={id} onClick={() => scrollTo(id)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 animate-fade-in-up"
            style={{
              background: active === id ? 'rgba(var(--brand-rgb), 0.15)' : 'transparent',
              color: active === id ? 'var(--color-brand)' : 'var(--color-text-muted)',
              animationDelay: `${i * 50}ms`,
            }}>
            <Icon size={16} />{label}
          </button>
        ))}
      </nav>
      <div className="px-6 pt-4 space-y-3 animate-fade-in-up"
        style={{ borderTop: '1px solid var(--color-border)', animationDelay: `${NAV.length * 50}ms` }}>
        <button
          onClick={onResumeClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: `linear-gradient(135deg, var(--color-brand), rgba(var(--brand-rgb), 0.8))` }}>
          <Download size={15} /> Download Resume
        </button>
        <ShareButton name={displayName} title={about?.title || ''} />
      </div>
    </div>
  );
};

export default MobileNav;
