import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Download, FileText, Copy } from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import generateResumePDF from '../utils/generateResumePDF';
import generateResumeTwoCol from '../utils/generateResumeTwoCol';
import generateResumeModern from '../utils/generateResumeModern';
import generateResumeCreative from '../utils/generateResumeCreative';
import generateResumeExecutive from '../utils/generateResumeExecutive';
import generateResumeTech from '../utils/generateResumeTech';
import generateResumeMinimal from '../utils/generateResumeMinimal';
import generateResumeDOCX from '../utils/generateResumeDOCX';

const generators = {
  classic: generateResumePDF, twocol: generateResumeTwoCol, modern: generateResumeModern,
  creative: generateResumeCreative, executive: generateResumeExecutive, tech: generateResumeTech, minimal: generateResumeMinimal,
};

const templateNames = {
  classic: 'Classic', twocol: 'Two Column', modern: 'Modern', creative: 'Creative',
  executive: 'Executive', tech: 'Tech', minimal: 'Minimal',
};

const AdminResumeVersions = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', template: 'classic', format: 'pdf' });
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchData = async (p = page) => {
    try {
      const r = await api.get(`/resume-versions?page=${p}&limit=10`);
      setItems(r.data.data || []);
      setTotalPages(r.data.totalPages || 1);
    } catch { showToast('Failed to load', 'error'); }
  };

  useEffect(() => { fetchData(page); }, [page]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Fetch current portfolio data to snapshot
      const [aboutR, skillsR, expR, eduR, svcR] = await Promise.all([
        api.get('/about'), api.get('/skills'), api.get('/experience'), api.get('/education'), api.get('/services'),
      ]);
      const snapshot = {
        about: aboutR.data || {},
        skills: skillsR.data || [],
        experience: expR.data || [],
        education: eduR.data || [],
        services: svcR.data || [],
      };
      await api.post('/resume-versions', { ...form, snapshot });
      showToast('Resume version saved');
      setModal(false);
      fetchData(page);
    } catch { showToast('Failed to save', 'error'); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/resume-versions/${id}`); showToast('Deleted'); fetchData(page); }
    catch { showToast('Failed to delete', 'error'); }
  };

  const handleDownload = async (item) => {
    const data = item.snapshot || {};
    if (!data.skills) data.skills = [];
    if (!data.experience) data.experience = [];
    if (!data.education) data.education = [];
    if (!data.services) data.services = [];
    if (!data.about) data.about = {};

    if (item.format === 'docx') {
      generateResumeDOCX(data);
    } else {
      const gen = generators[item.template] || generateResumePDF;
      const result = await gen(data);
      if (result?.doc) result.doc.save(result.fileName);
    }
  };

  const inputCls = 'w-full rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-600 outline-none text-sm';
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#0f0f13' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8 animate-fade-in-up">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors text-sm">
            <ArrowLeft size={18} /> Back
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">Resume Versions</h2>
          <button onClick={() => { setForm({ name: '', template: 'classic', format: 'pdf' }); setModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            <Plus size={16} /> Save Current Version
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <Copy size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-slate-500 text-sm">No saved versions yet. Save a snapshot of your current resume for different job applications.</p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            {items.map(item => (
              <div key={item._id} className="glass rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">{item.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {templateNames[item.template] || item.template} · {item.format?.toUpperCase()} · {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleDownload(item)} className="p-2 rounded-lg text-slate-400 hover:text-blue-400 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Download size={15} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>

      {/* Save Version Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setModal(false)}>
          <div className="rounded-2xl w-full max-w-md animate-slide-up" style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-base font-bold text-white">Save Resume Version</h3>
              <button onClick={() => setModal(false)} className="text-slate-500 hover:text-slate-200">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Version Name</label>
                <input type="text" placeholder="e.g. Google Frontend Application" className={inputCls} style={inputStyle}
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Template</label>
                  <select className={inputCls} style={inputStyle} value={form.template} onChange={e => setForm(f => ({ ...f, template: e.target.value }))}>
                    {Object.entries(templateNames).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Format</label>
                  <select className={inputCls} style={inputStyle} value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))}>
                    <option value="pdf">PDF</option>
                    <option value="docx">DOCX</option>
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-slate-600">This will save a snapshot of your current portfolio data with the selected template and format.</p>
              <button type="submit" className="w-full py-2.5 rounded-xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                Save Version
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminResumeVersions;
