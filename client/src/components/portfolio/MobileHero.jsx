import { MapPin, Mail } from 'lucide-react';
import { LinkedInIcon } from '../portfolio';

const MobileHero = ({ about, displayName, initials }) => (
  <div className="lg:hidden text-center animate-fade-in-up">
    <div className="w-24 h-24 rounded-2xl mx-auto overflow-hidden flex items-center justify-center text-3xl font-extrabold text-white mb-4"
      style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 40px rgba(124,58,237,0.35)' }}>
      {about?.avatar
        ? <img src={about.avatar} alt={displayName} className="w-full h-full object-cover" />
        : initials}
    </div>
    <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>{displayName}</h1>
    {about?.title && <p className="text-xs font-semibold uppercase tracking-widest mt-1 text-violet-400">{about.title}</p>}
    {about?.openToWork && (
      <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
        Open to Work
      </div>
    )}
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {(about?.city && about?.country) && (
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <MapPin size={12} className="text-violet-400" /> {about.city}, {about.country}
        </span>
      )}
      {about?.email && (
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <Mail size={12} className="text-violet-400" /> {about.email}
        </span>
      )}
      {about?.linkedin && (
        <a
          href={about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`}
          target="_blank" rel="noreferrer noopener"
          className="flex items-center gap-1.5 text-xs hover:text-violet-400 transition-colors"
          style={{ color: 'var(--color-text-muted)' }}>
          <LinkedInIcon size={12} className="text-violet-400" />
          LinkedIn
        </a>
      )}
    </div>
  </div>
);

export default MobileHero;
