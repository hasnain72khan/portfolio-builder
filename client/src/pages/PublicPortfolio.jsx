import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Code2, Layers, MapPin, Mail, Phone, Download, ArrowUp, Menu, X,
  Briefcase, User, ChevronRight, Zap, Sun, Moon,
  Clock, GraduationCap, MessageSquare, Star, Quote
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import ChatWidget from '../components/ChatWidget';
import ResumeModal from '../components/ResumeModal';
import ShareButton from '../components/ShareButton';
import ScrollReveal from '../components/ScrollReveal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

const categoryColor = (cat) => {
  const colors = [
    { bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.3)', text: '#a78bfa' },
    { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.3)',  text: '#93c5fd' },
    { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.3)',  text: '#6ee7b7' },
    { bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.3)',   text: '#67e8f9' },
    { bg: 'rgba(244,63,94,0.15)',   border: 'rgba(244,63,94,0.3)',   text: '#fda4af' },
    { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.3)',  text: '#fcd34d' },
  ];
  let hash = 0;
  for (let i = 0; i < cat.length; i++) hash = cat.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const levelDot = { Expert: '#a78bfa', Intermediate: '#93c5fd', Beginner: '#64748b' };

const updateMeta = (key, value, attr = 'name') => {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const NAV = [
  { id: 'about',        label: 'About',        icon: User },
  { id: 'services',     label: 'Services',     icon: Briefcase },
  { id: 'skills',       label: 'Skills',       icon: Code2 },
  { id: 'experience',   label: 'Experience',   icon: Clock },
  { id: 'education',    label: 'Education',    icon: GraduationCap },
  { id: 'projects',     label: 'Projects',     icon: Layers },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
];

const PublicPortfolio = () => {
  const { username }            = useParams();
  const [data, setData]         = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [active, setActive]     = useState('about');
  const [mobileNav, setMobileNav] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isDark, setIsDark]     = useState(() => {
    const saved = localStorage.getItem('portfolio-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    isDark ? root.classList.remove('light') : root.classList.add('light');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    axios.get(`${API_BASE}/public/${username}`)
      .then(r => {
        setData(r.data);
        const name = r.data.about?.name || r.data.user?.name || username;
        const title = r.data.about?.title || '';
        const bio = r.data.about?.bio || '';
        const avatar = r.data.about?.avatar || '';

        // Page title
        document.title = `${name} — ${title || 'Portfolio'}`;

        // Meta description
        updateMeta('description', bio || `${name}'s professional portfolio`);

        // Open Graph
        updateMeta('og:title', `${name} — ${title || 'Portfolio'}`, 'property');
        updateMeta('og:description', bio || `Check out ${name}'s portfolio`, 'property');
        updateMeta('og:type', 'website', 'property');
        updateMeta('og:url', window.location.href, 'property');
        if (avatar) updateMeta('og:image', avatar, 'property');

        // Twitter Card
        updateMeta('twitter:card', 'summary', 'name');
        updateMeta('twitter:title', `${name} — ${title || 'Portfolio'}`, 'name');
        updateMeta('twitter:description', bio || `Check out ${name}'s portfolio`, 'name');
        if (avatar) updateMeta('twitter:image', avatar, 'name');
      })
      .catch(() => setNotFound(true));
  }, [username]);

  useEffect(() => {
    const sections = NAV.map(n => document.getElementById(n.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.4 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [data]);

  useEffect(() => {
    const mainEl = document.getElementById('portfolio-main');
    if (!mainEl) return;
    const handleScroll = () => setShowScrollTop(mainEl.scrollTop > 400);
    mainEl.addEventListener('scroll', handleScroll);
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, [data]);

  const grouped = useMemo(() => groupSkillsByCategory(data?.skills || []), [data]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
    setMobileNav(false);
  };

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f13' }}>
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h2 className="text-2xl font-bold text-white mb-2">Portfolio not found</h2>
        <p className="text-slate-500">No portfolio exists for <span className="text-violet-400">@{username}</span></p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f13' }}>
      <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
    </div>
  );

  const { about, projects, skills, services, experience, education, testimonials } = data;
  const displayName = capitalizeName(about?.name || data.user?.name || '');
  const initials = displayName ? displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* Mobile Header */}
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
          <button onClick={() => setMobileNav(v => !v)} className="p-2 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
            {mobileNav ? <X size={18} style={{ color: 'var(--color-text)' }} /> : <Menu size={18} style={{ color: 'var(--color-text)' }} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Dropdown */}
      {mobileNav && (
        <div className="lg:hidden fixed inset-0 z-40 pt-16" style={{ background: 'var(--mobile-header-bg)', backdropFilter: 'blur(16px)' }}>
          <nav className="px-6 py-4 space-y-1">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: active === id ? 'rgba(124,58,237,0.15)' : 'transparent',
                  color: active === id ? '#a78bfa' : 'var(--color-text-muted)',
                }}>
                <Icon size={16} />{label}
              </button>
            ))}
          </nav>
          <div className="px-6 pt-4 space-y-3" style={{ borderTop: '1px solid var(--color-border)' }}>
            <button
              onClick={() => { setShowResumeModal(true); setMobileNav(false); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              <Download size={15} /> Download Resume
            </button>
            <ShareButton name={displayName} title={about?.title || ''} />
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0 sticky top-0 h-screen overflow-y-auto"
        style={{ background: 'var(--color-sidebar)', borderRight: '1px solid var(--color-border)', transition: 'background 0.3s ease' }}>

        <div className="flex flex-col items-center text-center px-8 pt-12 pb-8">
          <div className="w-28 h-28 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center text-4xl font-extrabold text-white mb-5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 40px rgba(124,58,237,0.35)' }}>
            {about?.avatar
              ? <img src={about.avatar} alt={displayName} className="w-full h-full object-cover" />
              : initials}
          </div>
          <h1 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>{displayName}</h1>
          {about?.title && <p className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: '#a78bfa' }}>{about.title}</p>}
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
              <a key={text} href={href} className="flex items-center gap-3 text-sm hover:text-violet-400 transition-colors" style={{ color: 'var(--color-text-sub)' }}>
                <Icon size={15} className="text-violet-400 flex-shrink-0" />
                <span className="truncate">{text}</span>
              </a>
            ) : (
              <div key={text} className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-text-sub)' }}>
                <Icon size={15} className="text-violet-400 flex-shrink-0" />
                <span className="truncate">{text}</span>
              </div>
            )
          ))}
          {about?.linkedin && (
            <a href={about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`}
              target="_blank" rel="noreferrer noopener"
              className="flex items-center gap-3 text-sm hover:text-violet-400 transition-colors group"
              style={{ color: 'var(--color-text-sub)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-violet-400 flex-shrink-0">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="truncate group-hover:underline">LinkedIn</span>
            </a>
          )}
          {about?.github && (
            <a href={about.github.startsWith('http') ? about.github : `https://github.com/${about.github}`}
              target="_blank" rel="noreferrer noopener"
              className="flex items-center gap-3 text-sm hover:text-violet-400 transition-colors group"
              style={{ color: 'var(--color-text-sub)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-violet-400 flex-shrink-0">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
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
                background: active === id ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: active === id ? '#a78bfa' : 'var(--color-text-muted)',
                border: active === id ? '1px solid rgba(124,58,237,0.25)' : '1px solid transparent',
              }}>
              <Icon size={16} />{label}
              {active === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="mx-8 h-px" style={{ background: 'var(--color-border)' }} />

        <div className="px-8 py-6 text-center space-y-3">
          <button
            onClick={() => setShowResumeModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            <Download size={15} /> Download Resume
          </button>
          <button onClick={() => setIsDark(d => !d)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text-sub)' }}>
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-violet-400" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <ShareButton name={displayName} title={about?.title || ''} />
        </div>
      </aside>

      {/* Main */}
      <main id="portfolio-main" className="flex-1 overflow-y-auto">
        {/* Mobile spacer for fixed header */}
        <div className="lg:hidden h-16" />

        <div className="max-w-3xl mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-24">

          {/* Mobile Hero (visible only on mobile since sidebar is hidden) */}
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
            </div>
          </div>

          {/* About */}
          <ScrollReveal>
          <section id="about">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                <User size={16} className="text-violet-400" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>About Me</h2>
              <div className="flex-1 h-px ml-2" style={{ background: 'var(--color-border)' }} />
            </div>
            <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              {about?.bio && <p className="leading-relaxed" style={{ color: 'var(--color-text)' }}>{about.bio}</p>}
              {about?.bio2 && <p className="leading-relaxed" style={{ color: 'var(--color-text-sub)' }}>{about.bio2}</p>}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { value: about?.yearsExp || '—',     label: 'Years Exp.' },
                  { value: about?.projectCount || '—', label: 'Projects' },
                  { value: about?.techCount || '—',    label: 'Technologies' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center py-4 rounded-xl" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
                    <p className="text-2xl font-extrabold text-violet-400">{value}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          </ScrollReveal>

          {/* Services */}
          {services.length > 0 && (
            <ScrollReveal>
            <section id="services">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <Briefcase size={16} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>Services</h2>
                <div className="flex-1 h-px ml-2" style={{ background: 'var(--color-border)' }} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map((s, i) => {
                  const IconComponent = LucideIcons[s.icon] || Zap;
                  return (
                  <div key={s._id} className="rounded-2xl p-5 flex gap-4 transition-all duration-300 group"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                      <IconComponent size={18} className="text-violet-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-heading)' }}>{s.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{s.description}</p>
                    </div>
                  </div>
                  );
                })}
              </div>
            </section>
            </ScrollReveal>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <ScrollReveal>
            <section id="skills">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <Code2 size={16} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>Skills</h2>
                <div className="flex-1 h-px ml-2" style={{ background: 'var(--color-border)' }} />
              </div>
              <div className="space-y-5">
                {Array.from(grouped.entries()).map(([category, items]) => {
                  const col = categoryColor(category);
                  return (
                    <div key={category} className="rounded-2xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                          style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}>{category}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {items.map(skill => (
                          <span key={skill._id} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)' }}>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: levelDot[skill.level] ?? '#64748b' }} />
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            </ScrollReveal>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <ScrollReveal>
            <section id="experience">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <Clock size={16} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>Experience</h2>
                <div className="flex-1 h-px ml-2" style={{ background: 'var(--color-border)' }} />
              </div>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp._id} className="rounded-2xl p-5 relative pl-8" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <div className="absolute left-5 top-7 w-2 h-2 rounded-full bg-violet-400" />
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--color-heading)' }}>{exp.title}</h3>
                        <p className="text-xs font-medium text-violet-400">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                      </div>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)' }}>
                        {exp.startDate} — {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.description && <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--color-text-sub)' }}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
            </ScrollReveal>
          )}

          {/* Education */}
          {education.length > 0 && (
            <ScrollReveal>
            <section id="education">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <GraduationCap size={16} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>Education</h2>
                <div className="flex-1 h-px ml-2" style={{ background: 'var(--color-border)' }} />
              </div>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu._id} className="rounded-2xl p-5 relative pl-8" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <div className="absolute left-5 top-7 w-2 h-2 rounded-full bg-teal-400" />
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--color-heading)' }}>{edu.degree}</h3>
                        <p className="text-xs font-medium text-teal-400">{edu.institution}</p>
                      </div>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)' }}>
                        {edu.startDate} — {edu.endDate || 'Present'}
                      </span>
                    </div>
                    {edu.description && <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--color-text-sub)' }}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
            </ScrollReveal>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <ScrollReveal>
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
                  <div key={project._id} className="group rounded-2xl p-6 transition-all duration-300"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                          {project.title?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-base truncate" style={{ color: 'var(--color-heading)' }}>{project.title}</h3>
                          {project.pageType && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                              {project.pageType}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noreferrer noopener"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                            Live
                          </a>
                        )}
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noreferrer noopener"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)' }}>
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-sub)' }}>{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack?.map((tech, ti) => (
                        <span key={ti} className="font-mono text-[10px] px-2 py-0.5 rounded-md"
                          style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            </ScrollReveal>
          )}

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <ScrollReveal>
            <section id="testimonials">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <MessageSquare size={16} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>Testimonials</h2>
                <div className="flex-1 h-px ml-2" style={{ background: 'var(--color-border)' }} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <div key={t._id} className="rounded-2xl p-5 relative" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <Quote size={24} className="text-violet-500/20 absolute top-4 right-4" />
                    <p className="text-sm leading-relaxed mb-4 italic" style={{ color: 'var(--color-text-sub)' }}>"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                        {t.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>{t.name}</p>
                        {t.role && <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{t.role}</p>}
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {Array.from({ length: 5 }, (_, j) => (
                          <Star key={j} size={11} className={j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
                        ))}
                      </div>
                    </div>
                    {t.source && (
                      <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                        {t.sourceUrl ? (
                          <a href={t.sourceUrl} target="_blank" rel="noreferrer noopener"
                            className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors hover:opacity-80"
                            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                            Verified on {t.source}
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full"
                            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)' }}>
                            via {t.source}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
            </ScrollReveal>
          )}

        </div>

        {/* Footer */}
        <footer className="text-center py-8 mt-8" style={{ borderTop: '1px solid var(--color-border)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} {displayName}. All rights reserved.
          </p>
        </footer>
      </main>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => document.getElementById('portfolio-main')?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-22 z-50 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)', right: '5.5rem' }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <ChatWidget
        ownerName={displayName}
        ownerEmail={about?.email || ''}
        ownerPhone={about?.phone || ''}
        ownerAvatar={about?.avatar || ''}
      />
      <ResumeModal
        open={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        data={{ about, skills, experience, education, services }}
      />
    </div>
  );
};

export default PublicPortfolio;
