import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navbar, Hero, Features } from '../components/landing';

const TEMPLATES = [
  { name: 'Sidebar', desc: 'Fixed sidebar + scrollable content' },
  { name: 'Single Page', desc: 'Full-width hero + sections' },
  { name: 'Minimal', desc: 'Clean, centered, minimal' },
];

const STEPS = [
  { num: '01', title: 'Sign Up', desc: 'Create your account with email verification in under a minute.' },
  { num: '02', title: 'Fill Your Profile', desc: 'Add skills, projects, experience, education, and services.' },
  { num: '03', title: 'Share & Download', desc: 'Get your public portfolio URL and download resumes in any template.' },
];

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0f', color: '#e2e8f0' }}>
      <Navbar user={user} />
      <Hero />
      <Features />

      {/* Templates */}
      <section id="templates" className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#7c3aed' }}>Templates</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">3 Portfolio Layouts</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {TEMPLATES.map((t, i) => (
            <div key={t.name} className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
              style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-full aspect-[4/3] rounded-xl mb-4 flex items-center justify-center"
                style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.1)' }}>
                <span className="text-3xl font-extrabold" style={{ color: 'rgba(124,58,237,0.3)' }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-bold text-white text-base">{t.name}</h3>
              <p className="text-xs mt-1" style={{ color: '#64748b' }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#7c3aed' }}>How It Works</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Up and Running in 3 Steps</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {STEPS.map(s => (
            <div key={s.num} className="text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-xl font-extrabold"
                style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa' }}>
                {s.num}
              </div>
              <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="rounded-3xl p-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(99,102,241,0.08))', border: '1px solid rgba(124,58,237,0.15)' }}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">Ready to Stand Out?</h2>
          <p className="text-base mb-8" style={{ color: '#94a3b8' }}>Join professionals who showcase their work with PortfolioBuilder.</p>
          <Link to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="text-center py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-xs" style={{ color: '#64748b' }}>© {new Date().getFullYear()} PortfolioBuilder. Built with React, Node.js & MongoDB.</p>
      </footer>
    </div>
  );
};

export default Landing;
