import { MapPin, Mail, Phone, Download, ChevronRight, Sun, Moon } from 'lucide-react';
import ShareButton from '../ShareButton';
import { LinkedInIcon, GitHubIcon } from '../portfolio';

const Sidebar = ({ about, displayName, initials, active, scrollTo, isDark, setIsDark, onResumeClick, NAV }) => (
  <aside className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0 sticky top-0 h-screen overflow-y-auto sidebar-scroll"
    style={{ background: 'var(--color-sidebar)', borderRight: '1px solid var(--color-border)', transition: 'background 0.3s ease' }}>

    <div className="flex flex-col items-center text-center px-8 pt-12 pb-8">
      <div className="w-28 h-28 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center text-4xl font-extrabold text-white mb-5"
        style={{ background: `linear-gradient(135deg, var(--color-brand), rgba(var(--brand-rgb), 0.7))`, boxShadow: `0 0 40px rgba(var(--brand-rgb), 0.35)` }}>
        {about?.avatar
          ? <img src={about.avatar} alt={displayName} className="w-full h-full object-cover" />
          : initials}
      </div>
      <h1 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>{displayName}</h1>
      {about?.title && <p className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: 'var(--color-brand)' }}>{about.title}</p>}
      {about?.openToWork && (
        <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
          Open to Work
        </div>
      )}
    </div>

    <div className="mx-8 h-px" style={{ background: 'var(--color-border)' }} />

    <div className="px-8 py-6 space-y-3">
      {[
        { icon: MapPin, text: about?.city && about?.country ? `${about.city}, ${about.country}` : about?.location },
        { icon: Mail,   text: about?.email, href: about?.email ? `mailto:${about.email}` : null },
        { icon: Phone,  text: about?.phone, href: about?.phone ? `tel:${about.phone}` : null },
      ].filter(i => i.text).map(({ icon: Icon, text, href }) => (
        href ? (
          <a key={text} href={href} className="flex items-center gap-3 text-sm transition-colors" style={{ color: 'var(--color-text-sub)' }}>
            <Icon size={15} className="flex-shrink-0" style={{ color: 'var(--color-brand)' }} />
            <span className="truncate">{text}</span>
          </a>
        ) : (
          <div key={text} className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-text-sub)' }}>
            <Icon size={15} className="flex-shrink-0" style={{ color: 'var(--color-brand)' }} />
            <span className="truncate">{text}</span>
          </div>
        )
      ))}
      {about?.linkedin && (
        <a href={about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`}
          target="_blank" rel="noreferrer noopener"
          className="flex items-center gap-3 text-sm transition-colors group"
          style={{ color: 'var(--color-text-sub)' }}>
          <LinkedInIcon size={15} className="flex-shrink-0" style={{ color: 'var(--color-brand)' }} />
          <span className="truncate group-hover:underline">LinkedIn</span>
        </a>
      )}
      {about?.github && (
        <a href={about.github.startsWith('http') ? about.github : `https://github.com/${about.github}`}
          target="_blank" rel="noreferrer noopener"
          className="flex items-center gap-3 text-sm transition-colors group"
          style={{ color: 'var(--color-text-sub)' }}>
          <GitHubIcon size={15} className="flex-shrink-0" style={{ color: 'var(--color-brand)' }} />
          <span className="truncate group-hover:underline">GitHub</span>
        </a>
      )}
    </div>

    <div className="mx-8 h-px" style={{ background: 'var(--color-border)' }} />

    <nav className="px-4 py-6 flex-1">
      <p className="text-[10px] font-bold uppercase tracking-widest px-4 mb-3" style={{ color: 'var(--color-text-muted)' }}>Navigation</p>
      {NAV.map(({ id, label, icon: Icon }) => (
        <button key={id} onClick={() => scrollTo(id)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1"
          style={{
            background: active === id ? `rgba(var(--brand-rgb), 0.15)` : 'transparent',
            color: active === id ? 'var(--color-brand)' : 'var(--color-text-muted)',
            border: active === id ? `1px solid rgba(var(--brand-rgb), 0.25)` : '1px solid transparent',
          }}>
          <Icon size={16} />{label}
          {active === id && <ChevronRight size={14} className="ml-auto" />}
        </button>
      ))}
    </nav>

    <div className="mx-8 h-px" style={{ background: 'var(--color-border)' }} />

    <div className="px-8 py-6 space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onResumeClick}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: `linear-gradient(135deg, var(--color-brand), rgba(var(--brand-rgb), 0.8))` }}>
          <Download size={14} /> Resume
        </button>
        <ShareButton name={displayName} title={about?.title || ''} />
        <button onClick={() => setIsDark(d => !d)}
          className="p-2.5 rounded-xl transition-all"
          style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} style={{ color: 'var(--color-brand)' }} />}
        </button>
      </div>
    </div>
  </aside>
);

export default Sidebar;
