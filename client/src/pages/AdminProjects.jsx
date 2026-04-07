import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, ArrowLeft, ExternalLink, X, AlertTriangle } from 'lucide-react';
import api from '../api';

/* ─── Helpers ───────────────────────────────────────────────── */
const pageTypeBadge = (type) => {
  return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
};

/* ─── Toast ─────────────────────────────────────────────────── */
const Toast = ({ msg, type = 'error', onClose }) => (
  <div
    className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl animate-toast-in"
    style={{
      background: type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
      border: `1px solid ${type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
      backdropFilter: 'blur(12px)',
    }}
  >
    <span className={`text-sm font-medium ${type === 'error' ? 'text-red-300' : 'text-emerald-300'}`}>{msg}</span>
    <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors"><X size={16} /></button>
  </div>
);

/* ─── Component ─────────────────────────────────────────────── */
const AdminProjects = () => {
  const [data, setData]           = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast]         = useState(null);
  const [newProject, setNewProject] = useState({
    title: '', pageType: '', description: '', techStack: '', liveLink: '', githubLink: '',
  });

  const navigate = useNavigate();

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    api.get('/projects')
      .then(r => setData(r.data))
      .catch(() => showToast('Failed to load projects.'));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setData(d => d.filter(p => p._id !== id));
      setConfirmId(null);
      showToast('Project deleted.', 'success');
    } catch {
      showToast('Delete failed.');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = {
      ...newProject,
      techStack: newProject.techStack.split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      const res = await api.post('/projects', payload);
      setData(d => [...d, res.data]);
      setShowModal(false);
      setNewProject({ title: '', pageType: '', description: '', techStack: '', liveLink: '', githubLink: '' });
      showToast('Project added.', 'success');
    } catch {
      showToast('Failed to add project.');
    }
  };

  const inputCls = 'w-full rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 text-sm';
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const focusStyle = (e) => (e.target.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.4)');
  const blurStyle  = (e) => (e.target.style.boxShadow = 'none');

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#0f0f13' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in-up">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors duration-200 text-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">Project Management</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Project Title', 'Page Type', 'Tech Stack', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((project, i) => (
                <tr
                  key={project._id}
                  className="transition-colors duration-150 animate-fade-in-up"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', animationDelay: `${i * 40}ms` }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200 text-sm">{project.title}</span>
                      {project.liveLink && <ExternalLink size={13} className="text-slate-600" />}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${pageTypeBadge(project.pageType)}`}>
                      {project.pageType}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">{project.techStack?.join(', ')}</td>
                  <td className="px-5 py-4 text-right">
                    {confirmId === project._id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-slate-400 flex items-center gap-1"><AlertTriangle size={12} className="text-amber-400" /> Sure?</span>
                        <button onClick={() => handleDelete(project._id)} className="text-xs px-2.5 py-1 rounded-lg text-red-300 transition-colors" style={{ background: 'rgba(239,68,68,0.15)' }}>Yes</button>
                        <button onClick={() => setConfirmId(null)} className="text-xs px-2.5 py-1 rounded-lg text-slate-400 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>No</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(project._id)}
                        className="p-2 rounded-lg text-slate-600 hover:text-red-400 transition-colors duration-200"
                        style={{ background: 'transparent' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-600 text-sm">No projects yet. Add one above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass rounded-3xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-lg font-bold text-white">Add New Project</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300 transition-colors"><X size={22} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {[
                { label: 'Project Title', key: 'title', type: 'text', required: true, placeholder: 'e.g. Portfolio Website, Mobile App, Brand Identity' },
              ].map(({ label, key, type, required, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
                  <input required={required} type={type} placeholder={placeholder} className={inputCls} style={inputStyle}
                    value={newProject[key]} onFocus={focusStyle} onBlur={blurStyle}
                    onChange={e => setNewProject({ ...newProject, [key]: e.target.value })} />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Project Type</label>
                <input type="text" placeholder="e.g. Web App, Mobile App, Landing Page, Logo Design, E-commerce"
                  className={inputCls} style={inputStyle}
                  value={newProject.pageType} onFocus={focusStyle} onBlur={blurStyle}
                  onChange={e => setNewProject({ ...newProject, pageType: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Tools / Tech Stack <span className="normal-case text-slate-600">(comma separated)</span></label>
                <input type="text" placeholder="e.g. React, Figma, Photoshop, Node.js, WordPress" className={inputCls} style={inputStyle}
                  value={newProject.techStack} onFocus={focusStyle} onBlur={blurStyle}
                  onChange={e => setNewProject({ ...newProject, techStack: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea required rows={3} placeholder="Briefly describe what this project is about and your role in it..." className={inputCls} style={inputStyle}
                  value={newProject.description} onFocus={focusStyle} onBlur={blurStyle}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Live URL <span className="normal-case text-slate-600">(optional)</span></label>
                  <input type="url" placeholder="https://example.com" className={inputCls} style={inputStyle}
                    value={newProject.liveLink} onFocus={focusStyle} onBlur={blurStyle}
                    onChange={e => setNewProject({ ...newProject, liveLink: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">GitHub URL <span className="normal-case text-slate-600">(optional)</span></label>
                  <input type="url" placeholder="https://github.com/..." className={inputCls} style={inputStyle}
                    value={newProject.githubLink} onFocus={focusStyle} onBlur={blurStyle}
                    onChange={e => setNewProject({ ...newProject, githubLink: e.target.value })} />
                </div>
              </div>

              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-white mt-2 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                Save Project
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminProjects;
