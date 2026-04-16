import {
  Layers, Palette, Zap, Shield, Globe, Star,
  FileText, Download, Languages, QrCode, BarChart3, Search,
} from 'lucide-react';

const FEATURES = [
  { icon: Layers, title: '7 Resume Templates', desc: 'Classic, Modern, Two-Column, Creative, Executive, Tech, and Minimal.' },
  { icon: FileText, title: 'PDF & DOCX Export', desc: 'Download resumes in PDF or Word format. ATS-optimized.' },
  { icon: Languages, title: '15 Languages', desc: 'Auto-translate your resume to Spanish, French, Arabic, Chinese, Urdu, and more.' },
  { icon: QrCode, title: 'QR Code on Resume', desc: 'Every resume includes a scannable QR code linking to your live portfolio.' },
  { icon: Palette, title: 'Custom Themes', desc: 'Pick your accent color, choose from 3 portfolio layouts, toggle dark/light mode.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track portfolio views, resume downloads, contact clicks, and top referrers.' },
  { icon: Search, title: 'ATS Score Checker', desc: 'Paste a job description and get a compatibility score with keyword analysis.' },
  { icon: Shield, title: 'Secure Auth', desc: 'Email verification, JWT tokens, forgot password, and rate limiting.' },
  { icon: Globe, title: 'Public Portfolio URL', desc: 'Share your unique link — /portfolio/yourname — with anyone.' },
  { icon: Star, title: 'Cover Letters', desc: 'Create and manage cover letters for different job applications.' },
  { icon: Download, title: 'Resume Versioning', desc: 'Save snapshots of your resume for different jobs.' },
  { icon: Zap, title: 'Social Share Cards', desc: 'Rich preview cards when shared on WhatsApp, Twitter, or LinkedIn.' },
];

const Features = () => (
  <section id="features" className="max-w-6xl mx-auto px-6 py-24">
    <div className="text-center mb-16">
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#7c3aed' }}>Features</p>
      <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Everything You Need to Land Your Next Job</h2>
      <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#64748b' }}>
        A complete portfolio + resume platform built for 2026 job market standards.
      </p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {FEATURES.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="rounded-2xl p-5 transition-all duration-300 group"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
            style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <Icon size={18} className="text-violet-400" />
          </div>
          <h3 className="font-bold text-white text-sm mb-1.5">{title}</h3>
          <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Features;
