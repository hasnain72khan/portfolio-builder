import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import { AdminLayout, AdminHeader, AdminTable, TableRow, TableActions, Modal, FormField } from '../components/admin';

const AdminTestimonials = () => {
  const [data, setData]           = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast]         = useState(null);
  const [form, setForm]           = useState({ name: '', role: '', text: '', rating: 5, source: '', sourceUrl: '', order: 0 });
  const [saving, setSaving]       = useState(false);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const perPage = 10;

  const showToast = (msg, type = 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const fetchData = (p) => {
    api.get(`/testimonials?page=${p}&limit=${perPage}`)
      .then(r => { setData(r.data.data || []); setTotalPages(r.data.totalPages || 1); setTotal(r.data.total || 0); })
      .catch(() => showToast('Failed to load.'));
  };

  useEffect(() => { fetchData(1); }, []);

  const handlePageChange = (p) => { setPage(p); fetchData(p); };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/testimonials/${id}`);
      setConfirmId(null);
      showToast('Deleted.', 'success');
      const p = data.length === 1 && page > 1 ? page - 1 : page;
      setPage(p); fetchData(p);
    } catch { showToast('Delete failed.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/testimonials/${editItem._id}`, form);
        showToast('Updated.', 'success');
      } else {
        await api.post('/testimonials', form);
        showToast('Added.', 'success');
      }
      closeModal();
      fetchData(editItem ? page : 1);
      if (!editItem) setPage(1);
    } catch { showToast(editItem ? 'Failed to update.' : 'Failed to add.'); } finally { setSaving(false); }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name || '', role: item.role || '', text: item.text || '', rating: item.rating || 5, source: item.source || '', sourceUrl: item.sourceUrl || '', order: item.order || 0 });
    setShowModal(true);
  };

  const openAdd = () => { setEditItem(null); setForm({ name: '', role: '', text: '', rating: 5, source: '', sourceUrl: '', order: 0 }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  return (
    <AdminLayout>
      <AdminHeader title="Testimonials Management" addLabel="Add Testimonial" onAdd={openAdd} />

      <AdminTable columns={['Client', 'Review', 'Rating', 'Actions']} emptyText="No testimonials yet. Add one above.">
        {data.map(item => (
          <TableRow key={item._id}>
            <td className="px-5 py-4">
              <p className="font-medium text-slate-200 text-sm">{item.name}</p>
              <p className="text-xs text-slate-500">{item.role}</p>
            </td>
            <td className="px-5 py-4 text-slate-400 text-xs max-w-xs truncate">{item.text}</td>
            <td className="px-5 py-4">
              <div className="flex gap-0.5">{Array.from({ length: 5 }, (_, j) => (
                <Star key={j} size={12} className={j < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
              ))}</div>
            </td>
            <TableActions
              isConfirming={confirmId === item._id}
              onEdit={() => openEdit(item)}
              onDelete={() => setConfirmId(item._id)}
              onConfirm={() => handleDelete(item._id)}
              onCancel={() => setConfirmId(null)}
            />
          </TableRow>
        ))}
      </AdminTable>

      <Pagination page={page} totalPages={totalPages} total={total} perPage={perPage} onPageChange={handlePageChange} />

      <Modal open={showModal} title={editItem ? 'Edit Testimonial' : 'Add Testimonial'} submitLabel={editItem ? 'Update Testimonial' : 'Save Testimonial'} onClose={closeModal} onSubmit={handleSubmit} saving={saving}>
        <FormField label="Client Name" required placeholder="e.g. Sarah Johnson, Ahmed Ali" value={form.name} onChange={set('name')} />
        <FormField label="Client Role / Company" placeholder="e.g. CEO at TechCorp, Freelance Designer" value={form.role} onChange={set('role')} />
        <FormField label="Review Text" required rows={3} placeholder="What did the client say about your work?" value={form.text} onChange={set('text')} />
        <FormField label="Rating">
          <div className="flex gap-2 mt-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}
                className="p-1.5 rounded-lg transition-all duration-150"
                style={{ background: form.rating >= n ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${form.rating >= n ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                <Star size={18} className={form.rating >= n ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} />
              </button>
            ))}
          </div>
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Platform" placeholder="e.g. LinkedIn, Upwork, Fiverr, Google" value={form.source} onChange={set('source')} />
          <FormField label="Review URL" type="url" placeholder="https://linkedin.com/in/..." value={form.sourceUrl} onChange={set('sourceUrl')} />
        </div>
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
};

export default AdminTestimonials;
