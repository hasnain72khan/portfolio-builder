import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#templates', label: 'Templates' },
  { href: '#how-it-works', label: 'How It Works' },
];

const Navbar = ({ user }) => (
  <nav className="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-16 py-4"
    style={{ background: 'rgba(11,11,15,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
    <div className="flex items-center gap-2">
      <Sparkles size={18} className="text-violet-400" />
      <span className="text-base font-extrabold text-white tracking-tight">PortfolioBuilder</span>
    </div>
    <div className="hidden md:flex items-center gap-6">
      {NAV_LINKS.map(l => (
        <a key={l.href} href={l.href} className="text-xs font-medium transition-colors hover:text-white" style={{ color: '#64748b' }}>{l.label}</a>
      ))}
    </div>
    <div className="flex items-center gap-3">
      {user ? (
        <Link to="/admin" className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>Dashboard</Link>
      ) : (
        <>
          <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium" style={{ color: '#94a3b8' }}>Login</Link>
          <Link to="/register" className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>Get Started</Link>
        </>
      )}
    </div>
  </nav>
);

export default Navbar;
