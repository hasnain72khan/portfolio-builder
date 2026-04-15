import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, FileText, Download, X } from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import { jsPDF } from 'jspdf';

const empty = { title: '', company: '', jobTitle: '', content: '' };

const AdminCoverLetters = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchData = async (p = page) => {
    try {
      const r = await api.get(`/cover-letters?page=${p}&limit=10`);
      setItems(r.data.data || []);
      setTotalPages(r.data.totalPages || 1);
    } catch { showToast('Failed to load cover letters', 'error'); }
  };

  useEffect(() => { fetchData(page); }, [page]);

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (item) => { setForm({ title: item.title, company: item.company, jobTitle: item.jobTitle, content: item.content }); setEditId(item._id); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/cover-letters/${editId}`, form); showToast('Cover letter updated'); }
      else { await api.post('/cover-letters', form); showToast('Cover letter created'); }
      setModal(false); fetchData(page);
    } catch { showToast('Failed to save', 'error'); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/cover-letters/${id}`); showToast('Deleted'); fetchData(page); }
    catch { showToast('Failed to delete', 'error'); }
  };

  const downloadPDF = (item) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pw = 210, ml = 25, mr = 25, cw = pw - ml - mr;
    let y = 30;

    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(34, 34, 34);
    doc.text(item.title, ml, y);
    y += 10;

    if (item.company || item.jobTitle) {
      doc.setFont('times', 'italic');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`${item.jobTitle}${item.company ? ' at ' + item.company : ''}`, ml, y);
      y += 10;
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(ml, y, pw - mr, y);
    y += 10;

    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(item.content || '', cw);
    doc.text(lines, ml, y);

    const name = item.title.replace(/\s+/g, '_').toLowerCase();
    doc.save(`${name}_cover_letter.pdf`);
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputCls = 'w-full rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-600 outline-none text-sm';
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#0f0f13' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8 animate-fade-in-up">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors text-sm">
            <ArrowLeft size={18} /> Back
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">Cover Letters</h2>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            <Plus size={16} /> Add Cover Letter
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <FileText size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-slate-500 text-sm">No cover letters yet. Create one for your next job application.</p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            {items.map(item => (
              <div key={item._id} className="glass rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.jobTitle}{item.company ? ` at ${item.company}` : ''}
                    {' · '}{new Date(item.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => downloadPDF(item)} className="p-2 rounded-lg text-slate-400 hover:text-blue-400 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Download size={15} />
                  </button>
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-slate-400 hover:text-violet-400 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Pencil size={15} />
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setModal(false)}>
          <div className="rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto animate-slide-up" style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-base font-bold text-white">{editId ? 'Update Cover Letter' : 'Add Cover Letter'}</h3>
              <button onClick={() => setModal(false)} className="text-slate-500 hover:text-slate-200"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Title</label>
                <input type="text" placeholder="e.g. Frontend Developer Application" className={inputCls} style={inputStyle} value={form.title} onChange={set('title')} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Company</label>
                  <input type="text" placeholder="e.g. Google" className={inputCls} style={inputStyle} value={form.company} onChange={set('company')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Job Title</label>
                  <input type="text" placeholder="e.g. Senior Developer" className={inputCls} style={inputStyle} value={form.jobTitle} onChange={set('jobTitle')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Content</label>
                <textarea rows={10} placeholder="Write your cover letter content here..." className={inputCls} style={inputStyle} value={form.content} onChange={set('content')} />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                {editId ? 'Update Cover Letter' : 'Save Cover Letter'}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminCoverLetters;
