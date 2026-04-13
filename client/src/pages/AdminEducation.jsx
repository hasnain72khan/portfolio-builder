import { useEffect, useState } from 'react';
import api from '../api';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import { AdminLayout, AdminHeader, AdminTable, TableRow, TableActions, Modal, FormField } from '../components/admin';

const AdminEducation = () => {
  const [data, setData]           = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast]         = useState(null);
  const [form, setForm]           = useState({ degree: '', institution: '', startDate: '', endDate: '', description: '', order: 0 });
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const perPage = 10;

  const showToast = (msg, type = 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const fetchData = (p) => {
    api.get(`/education?page=${p}&limit=${perPage}`)
      .then(r => { setData(r.data.data || []); setTotalPages(r.data.totalPages || 1); setTotal(r.data.total || 0); })
      .catch(() => showToast('Failed to load.'));
  };

  useEffect(() => { fetchData(1); }, []);

  const handlePageChange = (p) => { setPage(p); fetchData(p); };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/education/${id}`);
      setConfirmId(null);
      showToast('Deleted.', 'success');
      const p = data.length === 1 && page > 1 ? page - 1 : page;
      setPage(p); fetchData(p);
    } catch { showToast('Delete failed.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/education/${editItem._id}`, form);
        showToast('Updated.', 'success');
      } else {
        await api.post('/education', form);
        showToast('Added.', 'success');
      }
      closeModal();
      fetchData(editItem ? page : 1);
      if (!editItem) setPage(1);
    } catch { showToast(editItem ? 'Failed to update.' : 'Failed to add.'); }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ degree: item.degree || '', institution: item.institution || '', startDate: item.startDate || '', endDate: item.endDate || '', description: item.description || '', order: item.order || 0 });
    setShowModal(true);
  };

  const openAdd = () => { setEditItem(null); setForm({ degree: '', institution: '', startDate: '', endDate: '', description: '', order: 0 }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  return (
    <AdminLayout>
      <AdminHeader title="Education Management" addLabel="Add Education" onAdd={openAdd} />

      <AdminTable columns={['Degree / Certificate', 'Institution', 'Duration', 'Actions']} emptyText="No education yet. Add one above.">
        {data.map(item => (
          <TableRow key={item._id}>
            <td className="px-5 py-4 font-medium text-slate-200 text-sm">{item.degree}</td>
            <td className="px-5 py-4 text-slate-400 text-sm">{item.institution}</td>
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

      <Modal open={showModal} title={editItem ? 'Edit Education' : 'Add Education'} submitLabel={editItem ? 'Update Education' : 'Save Education'} onClose={closeModal} onSubmit={handleSubmit}>
        <FormField label="Degree / Certificate" required placeholder="e.g. BS Computer Science, MBA, Photography Certificate" value={form.degree} onChange={set('degree')} />
        <FormField label="Institution" required placeholder="e.g. MIT, Coursera, University of London" value={form.institution} onChange={set('institution')} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date" placeholder="e.g. Sep 2018" value={form.startDate} onChange={set('startDate')} />
          <FormField label="End Date" placeholder="e.g. Jun 2022, Present" value={form.endDate} onChange={set('endDate')} />
        </div>
        <FormField label="Description" rows={3} placeholder="e.g. Relevant coursework, achievements, GPA..." value={form.description} onChange={set('description')} />
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
};

export default AdminEducation;
