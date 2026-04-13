import { MessageSquare, Star, Quote } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { SectionHeader, SurfaceCard } from '../portfolio';

const TestimonialsSection = ({ testimonials }) => {
  if (!testimonials.length) return null;

  return (
    <ScrollReveal>
      <section id="testimonials">
        <SectionHeader icon={MessageSquare} title="Testimonials" />
        <div className="grid sm:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <SurfaceCard key={t._id} className="p-5 relative">
              <Quote size={24} className="absolute top-4 right-4" style={{ color: 'rgba(var(--brand-rgb), 0.2)' }} />
              <p className="text-sm leading-relaxed mb-4 italic" style={{ color: 'var(--color-text-sub)' }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, var(--color-brand), rgba(var(--brand-rgb), 0.7))` }}>
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
            </SurfaceCard>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
};

export default TestimonialsSection;
