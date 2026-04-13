import { Code2 } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { SectionHeader, SurfaceCard } from '../portfolio';
import { categoryColor } from './utils';

const levelWidth = { Expert: '95%', Intermediate: '65%', Beginner: '35%' };
const levelLabel = { Expert: 'Expert', Intermediate: 'Intermediate', Beginner: 'Beginner' };

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
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}>{category}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{items.length} skills</span>
                </div>
                <div className="space-y-3">
                  {items.map(skill => (
                    <div key={skill._id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{skill.name}</span>
                        <span className="text-[10px] font-medium" style={{ color: col.text }}>{levelLabel[skill.level] || skill.level}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--glass-bg)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: levelWidth[skill.level] || '50%',
                            background: `linear-gradient(90deg, ${col.text}, ${col.border})`,
                            animation: 'skillBarFill 1s ease-out forwards',
                          }}
                        />
                      </div>
                    </div>
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
