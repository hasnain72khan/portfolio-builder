import { Layers } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { SectionHeader, SurfaceCard } from '../portfolio';

const ProjectsSection = ({ projects }) => {
  if (!projects.length) return null;

  return (
    <ScrollReveal>
      <section id="projects">
        <SectionHeader icon={Layers} title="Featured Projects" />
        <div className="space-y-4">
          {projects.map((project) => (
            <SurfaceCard key={project._id} className="group overflow-hidden transition-all duration-300" hoverable>
              {project.image && (
                <div className="overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg, var(--color-brand), rgba(var(--brand-rgb), 0.7))` }}>
                    {project.title?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base truncate" style={{ color: 'var(--color-heading)' }}>{project.title}</h3>
                    {project.pageType && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(var(--brand-rgb), 0.2)', color: 'rgba(var(--brand-rgb), 0.8)', border: '1px solid rgba(var(--brand-rgb), 0.3)' }}>
                        {project.pageType}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noreferrer noopener"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ background: `linear-gradient(135deg, var(--color-brand), rgba(var(--brand-rgb), 0.8))` }}>
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
            </SurfaceCard>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
};

export default ProjectsSection;
