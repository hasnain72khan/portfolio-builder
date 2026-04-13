import { useNavigate } from 'react-router-dom';
import { Layers, Code2, LogOut, Briefcase, User, GraduationCap, Clock, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const capitalizeName = (name) =>
  name ? name.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 pt-16 relative"
      style={{ background: '#0f0f13' }}
    >
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors duration-200 text-xs sm:text-sm"
      >
        <LogOut size={16} /> Logout
      </button>

      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-2">Welcome back, <span className="text-violet-400">{capitalizeName(user?.name)}</span></p>
        {user?.username && (
          <p className="text-slate-600 text-xs mt-1">
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
            <span className="text-lg font-bold text-white block">About</span>
            <span className="text-xs text-slate-500 mt-0.5 block">Edit profile info</span>
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
            <span className="text-lg font-bold text-white block">Manage Skills</span>
            <span className="text-xs text-slate-500 mt-0.5 block">Add, remove technical skills</span>
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
            <span className="text-lg font-bold text-white block">Manage Projects</span>
            <span className="text-xs text-slate-500 mt-0.5 block">Add, remove portfolio projects</span>
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
            <span className="text-lg font-bold text-white block">Manage Services</span>
            <span className="text-xs text-slate-500 mt-0.5 block">Add, remove services</span>
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
            <span className="text-lg font-bold text-white block">Experience</span>
            <span className="text-xs text-slate-500 mt-0.5 block">Work history & roles</span>
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
            <span className="text-lg font-bold text-white block">Education</span>
            <span className="text-xs text-slate-500 mt-0.5 block">Degrees & certificates</span>
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
            <span className="text-lg font-bold text-white block">Testimonials</span>
            <span className="text-xs text-slate-500 mt-0.5 block">Client reviews & feedback</span>
          </div>
        </button>

      </div>
    </div>
  );
};

export default Admin;
