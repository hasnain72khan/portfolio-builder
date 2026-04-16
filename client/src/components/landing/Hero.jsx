import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const STATS = [
  { val: '7', label: 'Resume Templates' },
  { val: '15', label: 'Languages' },
  { val: '3', label: 'Portfolio Layouts' },
];

const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 opacity-40"
      style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 60%)' }} />
    <div className="relative max-w-4xl mx-auto text-center px-6 pt-24 pb-28 lg:pt-36 lg:pb-40">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 animate-fade-in-up"
        style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa' }}>
        <Sparkles size={12} /> 7 Resume Templates · 15 Languages · ATS Optimized
      </div>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        Your Portfolio &{' '}
        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #818cf8, #6366f1)' }}>
          Resume Builder
        </span>
        {' '}in One Place
      </h1>
      <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ color: '#94a3b8', animationDelay: '200ms' }}>
        Create a stunning portfolio, generate professional resumes in 7 templates, translate to 15 languages, and track analytics — all free.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <Link to="/register"
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
          Create Your Portfolio <ArrowRight size={18} />
        </Link>
        <a href="#features"
          className="px-6 py-3.5 rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
          See Features
        </a>
      </div>
      <div className="flex items-center justify-center gap-8 mt-16 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        {STATS.map(s => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-extrabold text-white">{s.val}</p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: '#64748b' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Hero;
