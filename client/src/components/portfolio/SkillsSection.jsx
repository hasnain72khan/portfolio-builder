import { Code2 } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { SectionHeader, SurfaceCard } from '../portfolio';
import { categoryColor, levelDot } from './utils';

const SkillsSection = ({ grouped }) => {
  if (!grouped.size) return null;

  return (
    <ScrollReveal>
      <section id="skills">
        <SectionHeader icon={Code2} title="Skills" />
        <div className="space-y-5">
          {Array.from(grouped.entries()).map(([category, items]) => {
            const col = categoryColor(category);
            return (
              <SurfaceCard key={category} className="p-5">
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
              </SurfaceCard>
            );
          })}
        </div>
      </section>
    </ScrollReveal>
  );
};

export default SkillsSection;
