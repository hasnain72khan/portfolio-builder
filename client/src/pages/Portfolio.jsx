import { useEffect, useState, useMemo } from 'react';
import api from '../api';
import {
  Code2, Layers, ExternalLink, MapPin, Mail, Phone,
  Briefcase, User, ChevronRight, Sparkles, Zap, Sun, Moon
} from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

/* ─── Helpers ───────────────────────────────────────────────── */
const capitalizeName = (name) =>
  name ? name.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

const groupSkillsByCategory = (skills) => {
  const map = new Map();
  for (const skill of skills) {
    if (!map.has(skill.category)) map.set(skill.category, []);
    map.get(skill.category).push(skill);
  }
  return map;
};

const pageTypeBadge = (type) => {
  const map = {
    'PDP':          'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    'PLP':          'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    'Cart':         'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    'Success Page': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    'Shopify App':  'bg-green-500/20 text-green-300 border border-green-500/30',
  };
  return map[type] ?? 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
};

const categoryColor = (cat) => {
  const map = {
    Frontend: { bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.3)', text: '#a78bfa' },
    Backend:  { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.3)',  text: '#93c5fd' },
    Shopify:  { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.3)',  text: '#6ee7b7' },
    Database: { bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.3)',   text: '#67e8f9' },
    Tools:    { bg: 'rgba(100,116,139,0.15)', border: 'rgba(100,116,139,0.3)', text: '#94a3b8' },
  };
  return map[cat] ?? { bg: 'rgba(100,116,139,0.15)', border: 'rgba(100,116,139,0.3)', text: '#94a3b8' };
};

const levelDot = { Expert: '#a78bfa', Intermediate: '#93c5fd', Beginner: '#64748b' };

const NAV = [
  { id: 'about',    label: 'About',    icon: User },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'skills',   label: 'Skills',   icon: Code2 },
  { id: 'projects', label: 'Projects', icon: Layers },
];

/* ─── Component ─────────────────────────────────────────────── */
const Portfolio = () => {
  const [projects, setProjects]   = useState([]);
  const [skills, setSkills]       = useState([]);
  const [services, setServices]   = useState([]);
  const [about, setAbout]         = useState(null);
  const [active, setActive]       = useState('about');
  const [isDark, setIsDark]       = useState(() => {
    const saved = localStorage.getItem('portfolio-theme');
    return saved ? saved === 'dark' : true;
  });

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data)).catch(() => {});
    api.get('/skills').then(r => setSkills(r.data)).catch(() => {});
    api.get('/services').then(r => setServices(r.data)).catch(() => {});
    api.get('/about').then(r => setAbout(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const sections = NAV.map(n => document.getElementById(n.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.4 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const grouped = useMemo(() => groupSkillsByCategory(skills), [skills]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* ── LEFT SIDEBAR ─────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0 sticky top-0 h-screen overflow-y-auto"
        style={{ background: 'var(--color-sidebar)', borderRight: '1px solid var(--color-border)', transition: 'background 0.3s ease' }}
      >
        {/* Profile */}
        <div className="flex flex-col items-center text-center px-8 pt-12 pb-8">
          {/* Avatar */}
          <div
            className="w-28 h-28 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center text-4xl font-extrabold text-white mb-5 animate-fade-in-up"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              boxShadow: '0 0 40px rgba(124,58,237,0.35)',
            }}
          >
            {about?.avatar
              ? <img src={about.avatar} alt={about.name} className="w-full h-full object-cover" />
              : (about?.name
                  ? about.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                  : 'HK')
            }
          </div>

          <h1 className="text-xl font-extrabold tracking-tight animate-fade-in-up" style={{ color: 'var(--color-heading)', animationDelay: '80ms' }}>
            {capitalizeName(about?.name || 'Hasnain Khan')}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest mt-1 animate-fade-in-up" style={{ color: '#a78bfa', animationDelay: '120ms' }}>
            {about?.title || 'Full-Stack Developer'}
          </p>

          {/* Status badge */}
          {(about?.openToWork ?? true) && (
          <div
            className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-medium animate-fade-in-up"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7', animationDelay: '160ms' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            Open to Work
          </div>
          )}


        </div>

        {/* Divider */}
        <div className="mx-8 h-px" style={{ background: 'var(--color-border)' }} />

        {/* Contact info */}
        <div className="px-8 py-6 space-y-3">
          {[
            { icon: MapPin, text: about?.city && about?.country ? `${about.city}, ${about.country}` : about?.location || 'Pakistan' },
            { icon: Mail,   text: about?.email    || 'hasnain@email.com' },
            { icon: Phone,  text: about?.phone    || '+92 300 0000000' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-text-sub)' }}>
              <Icon size={15} className="text-violet-400 flex-shrink-0" />
              <span className="truncate">{text}</span>
            </div>
          ))}

          {/* LinkedIn */}
          {(about?.linkedin) && (
          <a
            href={about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-3 text-sm hover:text-violet-400 transition-colors duration-200 group"
            style={{ color: 'var(--color-text-sub)' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-violet-400 flex-shrink-0">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="truncate group-hover:underline">linkedin.com/in/hasnain</span>
          </a>
          )}
        </div>

        {/* Divider */}
        <div className="mx-8 h-px" style={{ background: 'var(--color-border)' }} />

        {/* Navigation */}
        <nav className="px-4 py-6 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest px-4 mb-3" style={{ color: 'var(--color-text-muted)' }}>Navigation</p>
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1"
              style={{
                background: active === id ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: active === id ? '#a78bfa' : '#64748b',
                border: active === id ? '1px solid rgba(124,58,237,0.25)' : '1px solid transparent',
              }}
            >
              <Icon size={16} />
              {label}
              {active === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-8 h-px" style={{ background: 'var(--color-border)' }} />

        {/* Footer */}
        <div className="px-8 py-6 text-center space-y-3">
          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(d => !d)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--color-text-sub)',
            }}
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-violet-400" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          {/* <p className="text-[11px] flex items-center justify-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
            <Sparkles size={11} className="text-violet-600" />
            Built with React &amp; Node.js
          </p> */}
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">

        {/* Mobile header */}
        <div
          className="lg:hidden flex items-center justify-between px-6 py-4 sticky top-0 z-40"
          style={{ background: 'var(--mobile-header-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-border)' }}
        >
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--color-heading)' }}>{about?.name || 'Hasnain Khan'}</p>
            <p className="text-[11px]" style={{ color: '#a78bfa' }}>{about?.title || 'Full-Stack Developer'}</p>
          </div>
          <div className="flex items-center gap-1">
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: active === id ? 'rgba(124,58,237,0.2)' : 'transparent',
                  color: active === id ? '#a78bfa' : 'var(--color-text-muted)',
                }}
              >
                {label}
              </button>
            ))}
            {/* Mobile theme toggle */}
            <button
              onClick={() => setIsDark(d => !d)}
              className="ml-1 p-2 rounded-lg transition-all duration-200"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
            >
              {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-violet-400" />}
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-24">

          {/* ── ABOUT ──────────────────────────────────────────── */}
          <section id="about" className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                <User size={16} className="text-violet-400" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>About Me</h2>
              <div className="flex-1 h-px ml-2" style={{ background: 'var(--color-border)' }} />
            </div>

            <div
              className="rounded-2xl p-6 space-y-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <p className="leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {about?.bio || "I'm a Full-Stack Developer with hands-on expertise in building modern web applications."}
              </p>
              {about?.bio2 && (
                <p className="leading-relaxed" style={{ color: 'var(--color-text-sub)' }}>{about.bio2}</p>
              )}

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { value: about?.yearsExp     || '3+',  label: 'Years Exp.' },
                  { value: about?.projectCount || '20+', label: 'Projects' },
                  { value: about?.techCount    || '10+', label: 'Technologies' },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="text-center py-4 rounded-xl"
                    style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}
                  >
                    <p className="text-2xl font-extrabold text-violet-400">{value}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SERVICES ───────────────────────────────────────── */}
          <section id="services">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                <Briefcase size={16} className="text-violet-400" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>Services</h2>
              <div className="flex-1 h-px ml-2" style={{ background: 'var(--color-border)' }} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((service, i) => (
                <div
                  key={service._id}
                  className="rounded-2xl p-5 flex gap-4 transition-all duration-300 animate-fade-in-up group"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    animationDelay: `${i * 60}ms`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
                  >
                    <Zap size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-heading)' }}>{service.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{service.description}</p>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
              <p className="text-sm col-span-2 py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>No services added yet.</p>
              )}
            </div>
          </section>

          {/* ── SKILLS ─────────────────────────────────────────── */}
          <section id="skills">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                <Code2 size={16} className="text-violet-400" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>Technical Skills</h2>
              <div className="flex-1 h-px ml-2" style={{ background: 'var(--color-border)' }} />
            </div>

            <div className="space-y-5">
              {Array.from(grouped.entries()).map(([category, items], gi) => {
                const col = categoryColor(category);
                return (
                  <div
                    key={category}
                    className="rounded-2xl p-5 animate-fade-in-up"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', animationDelay: `${gi * 60}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}
                      >
                        {category}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{items.length} skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill, i) => (
                        <span
                          key={skill._id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 cursor-default animate-fade-in-up"
                          style={{
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--color-text)',
                            animationDelay: `${gi * 60 + i * 30}ms`,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: levelDot[skill.level] ?? '#64748b' }}
                          />
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── PROJECTS ───────────────────────────────────────── */}
          <section id="projects">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                <Layers size={16} className="text-violet-400" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>Featured Projects</h2>
              <div className="flex-1 h-px ml-2" style={{ background: 'var(--color-border)' }} />
            </div>

            <div className="space-y-4">
              {projects.map((project, i) => (
                <div
                  key={project._id}
                  className="group rounded-2xl p-6 transition-all duration-300 animate-fade-in-up"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    animationDelay: `${i * 60}ms`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                      >
                        {project.title?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base truncate group-hover:text-violet-300 transition-colors duration-200" style={{ color: 'var(--color-heading)' }}>
                          {project.title}
                        </h3>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${pageTypeBadge(project.pageType)}`}>
                          {project.pageType}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/20"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                        >
                          <ExternalLink size={12} /> Live
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                          style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text-sub)' }}
                        >
                          <ExternalLink size={12} /> Code
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-sub)' }}>{project.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack?.map((tech, ti) => (
                      <span
                        key={ti}
                        className="font-mono text-[10px] px-2 py-0.5 rounded-md"
                        style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)' }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
              <div className="text-center py-16 text-sm" style={{ color: 'var(--color-text-muted)' }}>No projects yet.</div>
              )}
            </div>
          </section>

          {/* Bottom padding */}
          <div className="h-8" />
        </div>
      </main>

      <ChatWidget />
    </div>
  );
};

export default Portfolio;
