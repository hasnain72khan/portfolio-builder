import { User } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { SectionHeader, SurfaceCard, StatCard } from '../portfolio';

const AboutSection = ({ about }) => (
  <ScrollReveal>
    <section id="about">
      <SectionHeader icon={User} title="About Me" />
      <SurfaceCard className="p-6 space-y-4">
        {about?.bio && <p className="leading-relaxed" style={{ color: 'var(--color-text)' }}>{about.bio}</p>}
        {about?.bio2 && <p className="leading-relaxed" style={{ color: 'var(--color-text-sub)' }}>{about.bio2}</p>}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <StatCard value={about?.yearsExp || '—'} label="Years Exp." />
          <StatCard value={about?.projectCount || '—'} label="Projects" />
          <StatCard value={about?.techCount || '—'} label="Technologies" />
        </div>
      </SurfaceCard>
    </section>
  </ScrollReveal>
);

export default AboutSection;
