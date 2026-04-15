import { useState } from 'react';
import { Download, Sun, Moon, Mail, MapPin, Phone, Star } from 'lucide-react';
import ChatWidget from '../../ChatWidget';
import ResumeModal from '../../ResumeModal';
import ShareButton from '../../ShareButton';
import ScrollReveal from '../../ScrollReveal';
import { SurfaceCard, LinkedInIcon, GitHubIcon, ScrollToTop } from '../../portfolio';
import { categoryColor, levelDot } from '../utils';

const MinimalLayout = ({ data, translatedResumeData, isTranslating, displayName, initials, grouped, isDark, setIsDark }) => {
  const { about, projects, skills, services, experience, education, testimonials } = data;
  const [showResumeModal, setShowResumeModal] = useState(false);
  const resumeData = translatedResumeData || { about, skills, experience, education, services, username: data.user?.username };

  const SectionTitle = ({ children }) => (
    <h2 className="text-lg font-bold mb-6 pb-2" style={{ color: 'var(--color-heading)', borderBottom: '2px solid rgba(var(--brand-rgb), 0.2)' }}>{children}</h2>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* Top bar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-16 py-4"
        style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(12px)' }}>
        <span className="text-sm font-bold" style={{ color: 'var(--color-heading)' }}>{displayName}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowResumeModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
            style={{ background: `linear-gradient(135deg, var(--color-brand), rgba(var(--brand-rgb), 0.8))` }}>
            <Download size={13} /> Download Resume
          </button>
          <button onClick={() => setIsDark(d => !d)} className="p-2 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} style={{ color: 'var(--color-brand)' }} />}
          </button>
          <ShareButton name={displayName} title={about?.title || ''} />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16 space-y-16">

        {/* Profile */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center text-3xl font-extrabold text-white"
              style={{ background: `linear-gradient(135deg, var(--color-brand), rgba(var(--brand-rgb), 0.7))`, boxShadow: `0 0 30px rgba(var(--brand-rgb), 0.25)` }}>
              {about?.avatar ? <img src={about.avatar} alt={displayName} className="w-full h-full object-cover" /> : initials}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>{displayName}</h1>
              {about?.title && <p className="text-sm font-semibold uppercase tracking-widest mt-1" style={{ color: 'var(--color-brand)' }}>{about.title}</p>}
              {about?.openToWork && (
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-[11px] font-medium"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" /> Open to Work
                </div>
              )}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                {(about?.city && about?.country) && (
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <MapPin size={12} style={{ color: 'var(--color-brand)' }} /> {about.city}, {about.country}
                  </span>
                )}
                {about?.email && (
                  <a href={`mailto:${about.email}`} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <Mail size={12} style={{ color: 'var(--color-brand)' }} /> {about.email}
                  </a>
                )}
                {about?.phone && (
                  <a href={`tel:${about.phone}`} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <Phone size={12} style={{ color: 'var(--color-brand)' }} /> {about.phone}
                  </a>
                )}
                {about?.linkedin && (
                  <a href={about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`}
                    target="_blank" rel="noreferrer noopener" className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <LinkedInIcon size={12} style={{ color: 'var(--color-brand)' }} /> LinkedIn
                  </a>
                )}
                {about?.github && (
                  <a href={about.github.startsWith('http') ? about.github : `https://github.com/${about.github}`}
                    target="_blank" rel="noreferrer noopener" className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <GitHubIcon size={12} style={{ color: 'var(--color-brand)' }} /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* About */}
        {about?.bio && (
          <ScrollReveal>
            <SectionTitle>About</SectionTitle>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-sub)' }}>{about.bio}</p>
            {about?.bio2 && <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--color-text-muted)' }}>{about.bio2}</p>}
          </ScrollReveal>
        )}

        {/* Services */}
        {services?.length > 0 && (
          <ScrollReveal>
            <SectionTitle>Services</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map(s => (
                <SurfaceCard key={s._id} className="p-4" hoverable>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-heading)' }}>{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{s.description}</p>
                </SurfaceCard>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <ScrollReveal>
            <SectionTitle>Skills</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s._id} className="px-3 py-1.5 rounded-full text-sm"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)' }}>
                  {s.name}
                </span>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <ScrollReveal>
            <SectionTitle>Experience</SectionTitle>
            <div className="space-y-5">
              {experience.map(exp => (
                <div key={exp._id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--color-heading)' }}>
                      {exp.title} <span className="font-normal" style={{ color: 'var(--color-brand)' }}>@ {exp.company}</span>
                    </h3>
                    <span className="text-[11px] flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{exp.startDate} — {exp.endDate || 'Present'}</span>
                  </div>
                  {exp.location && <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{exp.location}</p>}
                  {exp.description && <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--color-text-sub)' }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <ScrollReveal>
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-5">
              {education.map(edu => (
                <div key={edu._id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--color-heading)' }}>{edu.degree}</h3>
                    <span className="text-[11px] flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{edu.startDate} — {edu.endDate || 'Present'}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-brand)' }}>{edu.institution}</p>
                  {edu.description && <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--color-text-sub)' }}>{edu.description}</p>}
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <ScrollReveal>
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-4">
              {projects.map(p => (
                <SurfaceCard key={p._id} className="overflow-hidden" hoverable>
                  {p.image && <img src={p.image} alt={p.title} className="w-full h-44 object-cover" />}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--color-heading)' }}>{p.title}</h3>
                        {p.pageType && <span className="text-[10px] font-medium" style={{ color: 'var(--color-brand)' }}>{p.pageType}</span>}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {p.liveLink && <a href={p.liveLink} target="_blank" rel="noreferrer" className="text-[11px] font-semibold" style={{ color: 'var(--color-brand)' }}>Live →</a>}
                        {p.githubLink && <a href={p.githubLink} target="_blank" rel="noreferrer" className="text-[11px] font-semibold" style={{ color: 'var(--color-text-muted)' }}>Code →</a>}
                      </div>
                    </div>
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--color-text-sub)' }}>{p.description}</p>
                    {p.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.techStack.map((t, i) => (
                          <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded"
                            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)' }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </SurfaceCard>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Testimonials */}
        {testimonials?.length > 0 && (
          <ScrollReveal>
            <SectionTitle>Testimonials</SectionTitle>
            <div className="space-y-4">
              {testimonials.map(t => (
                <SurfaceCard key={t._id} className="p-4">
                  <p className="text-sm leading-relaxed italic mb-3" style={{ color: 'var(--color-text-sub)' }}>"{t.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>{t.name}</p>
                      {t.role && <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{t.role}</p>}
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star key={j} size={11} className={j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
                      ))}
                    </div>
                  </div>
                </SurfaceCard>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>

      <footer className="text-center py-8" style={{ borderTop: '1px solid var(--color-border)' }}>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>© {new Date().getFullYear()} {displayName}</p>
      </footer>

      <ScrollToTop targetId={null} />
      <ChatWidget ownerName={displayName} ownerEmail={about?.email || ''} ownerPhone={about?.phone || ''} ownerAvatar={about?.avatar || ''} />
      <ResumeModal open={showResumeModal} onClose={() => setShowResumeModal(false)} data={resumeData} isTranslating={isTranslating} />
    </div>
  );
};

export default MinimalLayout;
