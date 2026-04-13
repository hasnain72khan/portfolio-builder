import { Link } from 'react-router-dom';
import { Sparkles, Layers, Palette, Zap, Shield, Globe, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: Layers,   title: 'Multi-Section Portfolio', desc: 'About, skills, projects, services, experience, education, and testimonials — all in one place.' },
  { icon: Palette,  title: 'Dark & Light Themes',     desc: 'Beautiful dark-mode-first design with a one-click light mode toggle for visitors.' },
  { icon: Zap,      title: 'Real-Time Updates',       desc: 'Edit your portfolio from the admin dashboard and see changes instantly on your public page.' },
  { icon: Shield,   title: 'Secure Auth',             desc: 'Email verification, JWT tokens, rate limiting, and password reset built in.' },
  { icon: Globe,    title: 'Public Portfolio URL',    desc: 'Share your unique link — /portfolio/your-name — with anyone, anywhere.' },
  { icon: Star,     title: 'Testimonials & Resume',   desc: 'Showcase client reviews and let visitors download your resume with one click.' },
];

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0f', color: '#e2e8f0' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-16 py-5">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-violet-400" />
          <span className="text-lg font-extrabold text-white tracking-tight">PortfolioBuilder</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/admin" className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/30"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium transition-colors" style={{ color: '#94a3b8' }}>
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/30"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 60%)' }} />
        <div className="relative max-w-4xl mx-auto text-center px-6 pt-20 pb-24 lg:pt-32 lg:pb-36">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}>
            <Sparkles size={12} /> Free & Open Source
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Build Your{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #818cf8, #6366f1)' }}>
              Professional Portfolio
            </span>
            {' '}in Minutes
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#94a3b8' }}>
            Create a stunning portfolio website with a powerful admin dashboard. Add your projects, skills, experience, and more — no coding required.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link to="/register"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              Create Your Portfolio <ArrowRight size={18} />
            </Link>
            <a href="#features"
              className="px-6 py-3.5 rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Everything You Need</h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: '#64748b' }}>
            A complete portfolio platform with all the features professionals need.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-6 transition-all duration-300 group"
              style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                <Icon size={20} className="text-violet-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="rounded-3xl p-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.1))', border: '1px solid rgba(124,58,237,0.2)' }}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to Stand Out?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#94a3b8' }}>
            Join developers, designers, and professionals who showcase their work with PortfolioBuilder.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs" style={{ color: '#64748b' }}>
          © {new Date().getFullYear()} PortfolioBuilder. Built with React & Node.js.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
