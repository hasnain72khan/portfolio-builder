import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, ArrowLeft, X, AlertTriangle } from 'lucide-react';
import api from '../api';

/* ─── Helpers ───────────────────────────────────────────────── */
const categoryBadge = (cat) => {
  const map = {
    Frontend: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    Backend:  'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    Shopify:  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    SQA:      'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    Database: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    Tools:    'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  };
  return map[cat] ?? 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
};

const levelDot = {
  Expert:       'bg-violet-400',
  Intermediate: 'bg-blue-400',
  Beginner:     'bg-slate-500',
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
const AdminSkills = () => {
  const [data, setData]           = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast]         = useState(null);
  const [newSkill, setNewSkill]   = useState({ name: '', category: '', level: 'Intermediate' });

  const navigate = useNavigate();

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    api.get('/skills')
      .then(r => setData(r.data))
      .catch(() => showToast('Failed to load skills.'));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/skills/${id}`);
      setData(d => d.filter(s => s._id !== id));
      setConfirmId(null);
      showToast('Skill deleted.', 'success');
    } catch {
      showToast('Delete failed.');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/skills', newSkill);
      setData(d => [...d, res.data]);
      setShowModal(false);
      setNewSkill({ name: '', category: '', level: 'Intermediate' });
      showToast('Skill added.', 'success');
    } catch {
      showToast('Failed to add skill.');
    }
  };

  const categories = [...new Set(data.map(s => s.category))];

  const inputCls = 'w-full rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 text-sm';
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const focusStyle = (e) => (e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.4)');
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
          <div className="text-center">
            <h2 className="text-xl font-bold text-white tracking-tight">Skills Management</h2>
            {data.length > 0 && (
              <p className="text-xs text-slate-500 mt-0.5">{data.length} skills across {categories.length} categories</p>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            <Plus size={16} /> Add Skill
          </button>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Skill Name', 'Category', 'Level', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr
                  key={item._id}
                  className="transition-colors duration-150 animate-fade-in-up"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', animationDelay: `${i * 40}ms` }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${levelDot[item.level] ?? 'bg-slate-500'}`} />
                      <span className="font-medium text-slate-200 text-sm">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${categoryBadge(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-500">{item.level}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {confirmId === item._id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-slate-400 flex items-center gap-1"><AlertTriangle size={12} className="text-amber-400" /> Sure?</span>
                        <button onClick={() => handleDelete(item._id)} className="text-xs px-2.5 py-1 rounded-lg text-red-300 transition-colors" style={{ background: 'rgba(239,68,68,0.15)' }}>Yes</button>
                        <button onClick={() => setConfirmId(null)} className="text-xs px-2.5 py-1 rounded-lg text-slate-400 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>No</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(item._id)}
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
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-600 text-sm">No skills yet. Add one above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass rounded-3xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-lg font-bold text-white">Add Skill</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300 transition-colors"><X size={22} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Skill Name</label>
                <input required type="text" placeholder="e.g. React.js, Photoshop, Public Speaking, Project Management"
                  className={inputCls} style={inputStyle}
                  value={newSkill.name} onFocus={focusStyle} onBlur={blurStyle}
                  onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                <input required type="text" placeholder="e.g. Design, Development, Marketing, Communication, Leadership"
                  className={inputCls} style={inputStyle}
                  value={newSkill.category} onFocus={focusStyle} onBlur={blurStyle}
                  onChange={e => setNewSkill({ ...newSkill, category: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Proficiency Level</label>
                <select className={inputCls} style={inputStyle} value={newSkill.level} onFocus={focusStyle} onBlur={blurStyle}
                  onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-white mt-2 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                Save Skill
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminSkills;
