import { Download, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import ChatWidget from '../../ChatWidget';
import ResumeModal from '../../ResumeModal';
import ShareButton from '../../ShareButton';
import {
  StatCard, LinkedInIcon, GitHubIcon, ScrollToTop,
  ServicesSection, SkillsSection,
  ExperienceSection, EducationSection, ProjectsSection, TestimonialsSection,
} from '../../portfolio';
import { MapPin, Mail, Phone } from 'lucide-react';

const SinglePageLayout = ({ data, translatedResumeData, isTranslating, displayName, initials, grouped, isDark, setIsDark }) => {
  const { about, projects, skills, services, experience, education, testimonials } = data;
  const [showResumeModal, setShowResumeModal] = useState(false);
  const resumeData = translatedResumeData || { about, skills, experience, education, services, username: data.user?.username };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* Hero */}
      <header className="relative overflow-hidden py-20 lg:py-32 text-center px-6">
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(var(--brand-rgb), 0.25) 0%, transparent 60%)' }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="w-28 h-28 rounded-2xl mx-auto overflow-hidden flex items-center justify-center text-4xl font-extrabold text-white mb-6"
            style={{ background: `linear-gradient(135deg, var(--color-brand), rgba(var(--brand-rgb), 0.7))`, boxShadow: `0 0 40px rgba(var(--brand-rgb), 0.35)` }}>
            {about?.avatar ? <img src={about.avatar} alt={displayName} className="w-full h-full object-cover" /> : initials}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>{displayName}</h1>
          {about?.title && <p className="text-sm font-semibold uppercase tracking-widest mt-2" style={{ color: 'var(--color-brand)' }}>{about.title}</p>}
          {about?.bio && <p className="mt-4 text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-sub)' }}>{about.bio}</p>}

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {(about?.city && about?.country) && (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <MapPin size={13} style={{ color: 'var(--color-brand)' }} /> {about.city}, {about.country}
              </span>
            )}
            {about?.email && (
              <a href={`mailto:${about.email}`} className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                <Mail size={13} style={{ color: 'var(--color-brand)' }} /> {about.email}
              </a>
            )}
            {about?.phone && (
              <a href={`tel:${about.phone}`} className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                <Phone size={13} style={{ color: 'var(--color-brand)' }} /> {about.phone}
              </a>
            )}
            {about?.linkedin && (
              <a href={about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`}
                target="_blank" rel="noreferrer noopener" className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                <LinkedInIcon size={13} style={{ color: 'var(--color-brand)' }} /> LinkedIn
              </a>
            )}
            {about?.github && (
              <a href={about.github.startsWith('http') ? about.github : `https://github.com/${about.github}`}
                target="_blank" rel="noreferrer noopener" className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                <GitHubIcon size={13} style={{ color: 'var(--color-brand)' }} /> GitHub
              </a>
            )}
          </div>

          {about?.openToWork && (
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              Open to Work
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button onClick={() => setShowResumeModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: `linear-gradient(135deg, var(--color-brand), rgba(var(--brand-rgb), 0.8))` }}>
              <Download size={14} /> Resume
            </button>
            <button onClick={() => setIsDark(d => !d)}
              className="p-2.5 rounded-xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
              {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} style={{ color: 'var(--color-brand)' }} />}
            </button>
            <ShareButton name={displayName} title={about?.title || ''} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mt-10">
            <StatCard value={about?.yearsExp || '—'} label="Years Exp." />
            <StatCard value={about?.projectCount || '—'} label="Projects" />
            <StatCard value={about?.techCount || '—'} label="Technologies" />
          </div>
        </div>
      </header>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-24">
        <ServicesSection services={services} />
        <SkillsSection grouped={grouped} />
        <ExperienceSection experience={experience} />
        <EducationSection education={education} />
        <ProjectsSection projects={projects} />
        <TestimonialsSection testimonials={testimonials} />
      </div>

      <footer className="text-center py-8" style={{ borderTop: '1px solid var(--color-border)' }}>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>© {new Date().getFullYear()} {displayName}</p>
      </footer>

      <ChatWidget ownerName={displayName} ownerEmail={about?.email || ''} ownerPhone={about?.phone || ''} ownerAvatar={about?.avatar || ''} />
      <ScrollToTop targetId={null} />
      <ResumeModal open={showResumeModal} onClose={() => setShowResumeModal(false)} data={resumeData} isTranslating={isTranslating} />
    </div>
  );
};

export default SinglePageLayout;
