import { useEffect, useState } from 'react';
import api from '../api';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import { AdminLayout, AdminHeader, AdminTable, TableRow, TableActions, Modal, FormField } from '../components/admin';

const AdminExperience = () => {
  const [data, setData]           = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast]         = useState(null);
  const [form, setForm]           = useState({ title: '', company: '', location: '', startDate: '', endDate: '', description: '', order: 0 });
  const [saving, setSaving]       = useState(false);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const perPage = 10;

  const showToast = (msg, type = 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const fetchData = (p) => {
    api.get(`/experience?page=${p}&limit=${perPage}`)
      .then(r => { setData(r.data.data || []); setTotalPages(r.data.totalPages || 1); setTotal(r.data.total || 0); })
      .catch(() => showToast('Failed to load.'));
  };

  useEffect(() => { fetchData(1); }, []);

  const handlePageChange = (p) => { setPage(p); fetchData(p); };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/experience/${id}`);
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
        await api.put(`/experience/${editItem._id}`, form);
        showToast('Updated.', 'success');
      } else {
        await api.post('/experience', form);
        showToast('Added.', 'success');
      }
      closeModal();
      fetchData(editItem ? page : 1);
      if (!editItem) setPage(1);
    } catch { showToast(editItem ? 'Failed to update.' : 'Failed to add.'); } finally { setSaving(false); }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ title: item.title || '', company: item.company || '', location: item.location || '', startDate: item.startDate || '', endDate: item.endDate || '', description: item.description || '', order: item.order || 0 });
    setShowModal(true);
  };

  const openAdd = () => { setEditItem(null); setForm({ title: '', company: '', location: '', startDate: '', endDate: '', description: '', order: 0 }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  return (
    <AdminLayout>
      <AdminHeader title="Experience Management" addLabel="Add Experience" onAdd={openAdd} />

      <AdminTable columns={['Title', 'Company', 'Duration', 'Actions']} emptyText="No experience yet. Add one above.">
        {data.map(item => (
          <TableRow key={item._id}>
            <td className="px-5 py-4 font-medium text-slate-200 text-sm">{item.title}</td>
            <td className="px-5 py-4 text-slate-400 text-sm">{item.company}</td>
            <td className="px-5 py-4 text-slate-500 text-xs">{item.startDate} — {item.endDate || 'Present'}</td>
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

      <Modal open={showModal} title={editItem ? 'Edit Experience' : 'Add Experience'} submitLabel={editItem ? 'Update Experience' : 'Save Experience'} onClose={closeModal} onSubmit={handleSubmit} saving={saving}>
        <FormField label="Job Title / Role" required placeholder="e.g. Senior Developer, Marketing Manager, Graphic Designer" value={form.title} onChange={set('title')} />
        <FormField label="Company / Organization" required placeholder="e.g. Google, Freelance, Self-Employed" value={form.company} onChange={set('company')} />
        <FormField label="Location" placeholder="e.g. Remote, New York, London" value={form.location} onChange={set('location')} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date" required placeholder="e.g. Jan 2022" value={form.startDate} onChange={set('startDate')} />
          <FormField label="End Date" placeholder="e.g. Present, Dec 2023" value={form.endDate} onChange={set('endDate')} />
        </div>
        <FormField label="Description" rows={3} placeholder="Brief description of your role and achievements..." value={form.description} onChange={set('description')} />
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
};

export default AdminExperience;
