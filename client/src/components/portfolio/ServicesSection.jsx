import { Briefcase, Zap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { SectionHeader, SurfaceCard } from '../portfolio';

const ServicesSection = ({ services }) => {
  if (!services.length) return null;

  return (
    <ScrollReveal>
      <section id="services">
        <SectionHeader icon={Briefcase} title="Services" />
        <div className="grid sm:grid-cols-2 gap-4">
          {services.map((s) => {
            const IconComponent = LucideIcons[s.icon] || Zap;
            return (
              <SurfaceCard key={s._id} className="p-5 flex gap-4 transition-all duration-300 group" hoverable>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <IconComponent size={18} className="text-violet-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-heading)' }}>{s.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{s.description}</p>
                </div>
              </SurfaceCard>
            );
          })}
        </div>
      </section>
    </ScrollReveal>
  );
};

export default ServicesSection;
