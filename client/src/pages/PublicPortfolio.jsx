import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowUp } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';
import ResumeModal from '../components/ResumeModal';
import {
  Sidebar, MobileHeader, MobileNav, MobileHero,
  AboutSection, ServicesSection, SkillsSection,
  ExperienceSection, EducationSection, ProjectsSection, TestimonialsSection,
} from '../components/portfolio';
import { NAV } from '../components/portfolio/constants';
import { capitalizeName, groupSkillsByCategory, updateMeta } from '../components/portfolio/utils';
import { SinglePageLayout, MinimalLayout } from '../components/portfolio/templates';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PublicPortfolio = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [active, setActive] = useState('about');
  const [mobileNav, setMobileNav] = useState(false);
  const [mobileNavClosing, setMobileNavClosing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme');
    return saved ? saved === 'dark' : true;
  });

  const closeMobileNav = () => {
    setMobileNavClosing(true);
    setTimeout(() => { setMobileNav(false); setMobileNavClosing(false); }, 200);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
    closeMobileNav();
  };

  /* Theme persistence */
  useEffect(() => {
    const root = document.documentElement;
    isDark ? root.classList.remove('light') : root.classList.add('light');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  /* Apply custom accent color */
  useEffect(() => {
    if (data?.about?.accentColor) {
      const c = data.about.accentColor;
      const root = document.documentElement;
      root.style.setProperty('--color-brand', c);
      // Parse hex to rgb for rgba usage
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);
      root.style.setProperty('--brand-rgb', `${r},${g},${b}`);
    }
    return () => {
      document.documentElement.style.removeProperty('--color-brand');
      document.documentElement.style.removeProperty('--brand-rgb');
    };
  }, [data]);

  /* Fetch portfolio data */
  useEffect(() => {
    axios.get(`${API_BASE}/public/${username}`)
      .then(r => {
        setData(r.data);
        const name = r.data.about?.name || r.data.user?.name || username;
        const title = r.data.about?.title || '';
        const bio = r.data.about?.bio || '';
        const avatar = r.data.about?.avatar || '';

        document.title = `${name} — ${title || 'Portfolio'}`;
        updateMeta('description', bio || `${name}'s professional portfolio`);
        updateMeta('og:title', `${name} — ${title || 'Portfolio'}`, 'property');
        updateMeta('og:description', bio || `Check out ${name}'s portfolio`, 'property');
        updateMeta('og:type', 'website', 'property');
        updateMeta('og:url', window.location.href, 'property');
        if (avatar) updateMeta('og:image', avatar, 'property');
        updateMeta('twitter:card', 'summary', 'name');
        updateMeta('twitter:title', `${name} — ${title || 'Portfolio'}`, 'name');
        updateMeta('twitter:description', bio || `Check out ${name}'s portfolio`, 'name');
        if (avatar) updateMeta('twitter:image', avatar, 'name');
      })
      .catch(() => setNotFound(true));
  }, [username]);

  /* Intersection observer for active nav */
  useEffect(() => {
    const sections = NAV.map(n => document.getElementById(n.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.4 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [data]);

  /* Scroll-to-top visibility */
  useEffect(() => {
    const mainEl = document.getElementById('portfolio-main');
    if (!mainEl) return;
    const handleScroll = () => setShowScrollTop(mainEl.scrollTop > 400);
    mainEl.addEventListener('scroll', handleScroll);
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, [data]);

  const grouped = useMemo(() => groupSkillsByCategory(data?.skills || []), [data]);

  /* Loading / error states */
  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f13' }}>
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h2 className="text-2xl font-bold text-white mb-2">Portfolio not found</h2>
        <p className="text-slate-500">No portfolio exists for <span style={{ color: 'var(--color-brand)' }}>@{username}</span></p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f13' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-brand)', borderTopColor: 'transparent' }} />
    </div>
  );

  const { about, projects, skills, services, experience, education, testimonials } = data;
  const displayName = capitalizeName(about?.name || data.user?.name || '');
  const initials = displayName ? displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '';
  const handleResumeClick = () => { setShowResumeModal(true); closeMobileNav(); };
  const template = about?.template || 'sidebar';

  // Render alternative templates
  if (template === 'single-page') {
    return <SinglePageLayout data={data} displayName={displayName} initials={initials} grouped={grouped} isDark={isDark} setIsDark={setIsDark} />;
  }
  if (template === 'minimal') {
    return <MinimalLayout data={data} displayName={displayName} initials={initials} grouped={grouped} isDark={isDark} setIsDark={setIsDark} />;
  }

  // Default: sidebar layout
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      <MobileHeader
        about={about} displayName={displayName} initials={initials}
        isDark={isDark} setIsDark={setIsDark}
        mobileNav={mobileNav} onToggleNav={() => mobileNav ? closeMobileNav() : setMobileNav(true)}
      />

      <MobileNav
        mobileNav={mobileNav} mobileNavClosing={mobileNavClosing}
        active={active} scrollTo={scrollTo} onResumeClick={handleResumeClick}
        displayName={displayName} about={about} NAV={NAV}
      />

      <Sidebar
        about={about} displayName={displayName} initials={initials}
        active={active} scrollTo={scrollTo}
        isDark={isDark} setIsDark={setIsDark}
        onResumeClick={handleResumeClick} NAV={NAV}
      />

      <main id="portfolio-main" className="flex-1 overflow-y-auto">
        <div className="lg:hidden h-16" />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-24">
          <MobileHero about={about} displayName={displayName} initials={initials} />
          <AboutSection about={about} />
          <ServicesSection services={services} />
          <SkillsSection grouped={grouped} />
          <ExperienceSection experience={experience} />
          <EducationSection education={education} />
          <ProjectsSection projects={projects} />
          <TestimonialsSection testimonials={testimonials} />
        </div>

        <footer className="text-center py-8 mt-8" style={{ borderTop: '1px solid var(--color-border)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} {displayName}. All rights reserved.
          </p>
        </footer>
      </main>

      {showScrollTop && !mobileNav && (
        <button
          onClick={() => document.getElementById('portfolio-main')?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed z-50 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
          style={{ background: `linear-gradient(135deg, var(--color-brand), rgba(var(--brand-rgb), 0.8))`, boxShadow: `0 4px 20px rgba(var(--brand-rgb), 0.4)`, bottom: '1.5rem', right: '5rem' }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <ChatWidget
        ownerName={displayName} ownerEmail={about?.email || ''}
        ownerPhone={about?.phone || ''} ownerAvatar={about?.avatar || ''}
      />
      <ResumeModal
        open={showResumeModal} onClose={() => setShowResumeModal(false)}
        data={{ about, skills, experience, education, services }}
      />
    </div>
  );
};

export default PublicPortfolio;
