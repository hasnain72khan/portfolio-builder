import { useNavigate } from 'react-router-dom';
import { Layers, Code2, LogOut, Briefcase, User, GraduationCap, Clock, MessageSquare, BarChart3, FileText, Copy, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';

const capitalizeName = (name) =>
  name ? name.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

const Admin = () => {
  const { user, logout } = useAuth();
  const { isDark, toggle, theme } = useAdminTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 pt-16 relative"
      style={{ background: theme.bg, color: theme.text }}
    >
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <button onClick={toggle} className="p-2 rounded-lg transition-colors" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
          aria-label="Toggle theme">
          {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
        </button>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors duration-200 text-xs sm:text-sm">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: theme.heading }}>Dashboard</h1>
        <p className="text-sm mt-2" style={{ color: theme.textMuted }}>Welcome back, <span className="text-violet-400">{capitalizeName(user?.name)}</span></p>
        {user?.username && (
          <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
            Your portfolio:{' '}
            <button onClick={() => navigate(`/portfolio/${user.username}`)} className="text-violet-400 hover:underline">
              /portfolio/{user.username}
            </button>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl">

        {/* About */}
        <button
          onClick={() => navigate('/admin/about')}
          className="group glass rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/[0.06] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: '40ms' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <User size={26} className="text-indigo-400" />
          </div>
          <div>
            <span style={{color: theme.heading}} className="text-lg font-bold block">About</span>
            <span style={{color: theme.textMuted}} className="text-xs mt-0.5 block">Edit profile info</span>
          </div>
        </button>

        {/* Skills */}
        <button
          onClick={() => navigate('/admin/skills')}
          className="group glass rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/[0.06] hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: '80ms' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
            <Code2 size={26} className="text-violet-400" />
          </div>
          <div>
            <span style={{color: theme.heading}} className="text-lg font-bold block">Manage Skills</span>
            <span style={{color: theme.textMuted}} className="text-xs mt-0.5 block">Add, remove technical skills</span>
          </div>
        </button>

        {/* Projects */}
        <button
          onClick={() => navigate('/admin/projects')}
          className="group glass rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/[0.06] hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: '160ms' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <Layers size={26} className="text-emerald-400" />
          </div>
          <div>
            <span style={{color: theme.heading}} className="text-lg font-bold block">Manage Projects</span>
            <span style={{color: theme.textMuted}} className="text-xs mt-0.5 block">Add, remove portfolio projects</span>
          </div>
        </button>

        {/* Services */}
        <button
          onClick={() => navigate('/admin/services')}
          className="group glass rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/[0.06] hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: '320ms' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Briefcase size={26} className="text-amber-400" />
          </div>
          <div>
            <span style={{color: theme.heading}} className="text-lg font-bold block">Manage Services</span>
            <span style={{color: theme.textMuted}} className="text-xs mt-0.5 block">Add, remove services</span>
          </div>
        </button>

        {/* Experience */}
        <button
          onClick={() => navigate('/admin/experience')}
          className="group glass rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/[0.06] hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: '400ms' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)' }}>
            <Clock size={26} className="text-rose-400" />
          </div>
          <div>
            <span style={{color: theme.heading}} className="text-lg font-bold block">Experience</span>
            <span style={{color: theme.textMuted}} className="text-xs mt-0.5 block">Work history & roles</span>
          </div>
        </button>

        {/* Education */}
        <button
          onClick={() => navigate('/admin/education')}
          className="group glass rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/[0.06] hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: '480ms' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.25)' }}>
            <GraduationCap size={26} className="text-teal-400" />
          </div>
          <div>
            <span style={{color: theme.heading}} className="text-lg font-bold block">Education</span>
            <span style={{color: theme.textMuted}} className="text-xs mt-0.5 block">Degrees & certificates</span>
          </div>
        </button>

        {/* Testimonials */}
        <button
          onClick={() => navigate('/admin/testimonials')}
          className="group glass rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/[0.06] hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: '560ms' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.25)' }}>
            <MessageSquare size={26} className="text-pink-400" />
          </div>
          <div>
            <span style={{color: theme.heading}} className="text-lg font-bold block">Testimonials</span>
            <span style={{color: theme.textMuted}} className="text-xs mt-0.5 block">Client reviews & feedback</span>
          </div>
        </button>
        {/* Analytics */}
        <button
          onClick={() => navigate('/admin/analytics')}
          className="group glass rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/[0.06] hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: '640ms' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
            <BarChart3 size={26} className="text-cyan-400" />
          </div>
          <div>
            <span style={{color: theme.heading}} className="text-lg font-bold block">Analytics</span>
            <span style={{color: theme.textMuted}} className="text-xs mt-0.5 block">Views & engagement</span>
          </div>
        </button>

        {/* Cover Letters */}
        <button
          onClick={() => navigate('/admin/cover-letters')}
          className="group glass rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/[0.06] hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: '720ms' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}>
            <FileText size={26} className="text-orange-400" />
          </div>
          <div>
            <span style={{color: theme.heading}} className="text-lg font-bold block">Cover Letters</span>
            <span style={{color: theme.textMuted}} className="text-xs mt-0.5 block">Job application letters</span>
          </div>
        </button>

        {/* Resume Versions */}
        <button
          onClick={() => navigate('/admin/resume-versions')}
          className="group glass rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/[0.06] hover:border-lime-500/40 hover:shadow-xl hover:shadow-lime-500/10 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: '800ms' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'rgba(132,204,22,0.12)', border: '1px solid rgba(132,204,22,0.25)' }}>
            <Copy size={26} className="text-lime-400" />
          </div>
          <div>
            <span style={{color: theme.heading}} className="text-lg font-bold block">Resume Versions</span>
            <span style={{color: theme.textMuted}} className="text-xs mt-0.5 block">Save & manage versions</span>
          </div>
        </button>

        {/* ATS Score */}
        {/* <button
          onClick={() => navigate('/admin/ats')}
          className="group glass rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/[0.06] hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: '880ms' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.25)' }}>
            <Search size={26} className="text-sky-400" />
          </div>
          <div>
            <span style={{color: theme.heading}} className="text-lg font-bold block">ATS Score</span>
            <span style={{color: theme.textMuted}} className="text-xs mt-0.5 block">Check resume vs job description</span>
          </div>
        </button> */}

      </div>
    </div>
  );
};

export default Admin;
