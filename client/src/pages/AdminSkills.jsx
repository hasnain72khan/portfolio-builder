import { useEffect, useState } from 'react';
import api from '../api';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import { AdminLayout, AdminHeader, AdminTable, TableRow, TableActions, Modal, FormField } from '../components/admin';

const categoryBadge = (cat) => {
  const map = {
    Frontend: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    Backend:  'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    Shopify:  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    Database: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    Tools:    'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  };
  return map[cat] ?? 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
};

const levelDot = { Expert: 'bg-violet-400', Intermediate: 'bg-blue-400', Beginner: 'bg-slate-500' };

const AdminSkills = () => {
  const [data, setData]           = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast]         = useState(null);
  const [form, setForm]           = useState({ name: '', category: '', level: 'Intermediate' });
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const perPage = 10;

  const showToast = (msg, type = 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const fetchData = (p) => {
    api.get(`/skills?page=${p}&limit=${perPage}`)
      .then(r => { setData(r.data.data || []); setTotalPages(r.data.totalPages || 1); setTotal(r.data.total || 0); })
      .catch(() => showToast('Failed to load skills.'));
  };

  useEffect(() => { fetchData(1); }, []);

  const handlePageChange = (p) => { setPage(p); fetchData(p); };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/skills/${id}`);
      setConfirmId(null);
      showToast('Skill deleted.', 'success');
      const p = data.length === 1 && page > 1 ? page - 1 : page;
      setPage(p); fetchData(p);
    } catch { showToast('Delete failed.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/skills/${editItem._id}`, form);
        showToast('Skill updated.', 'success');
      } else {
        await api.post('/skills', form);
        showToast('Skill added.', 'success');
      }
      closeModal();
      fetchData(editItem ? page : 1);
      if (!editItem) setPage(1);
    } catch { showToast(editItem ? 'Failed to update.' : 'Failed to add.'); }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name || '', category: item.category || '', level: item.level || 'Intermediate' });
    setShowModal(true);
  };

  const openAdd = () => { setEditItem(null); setForm({ name: '', category: '', level: 'Intermediate' }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  return (
    <AdminLayout>
      <AdminHeader title="Skills Management" addLabel="Add Skill" onAdd={openAdd} />

      <AdminTable columns={['Skill Name', 'Category', 'Level', 'Actions']} emptyText="No skills yet. Add one above.">
        {data.map(item => (
          <TableRow key={item._id}>
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
            <td className="px-5 py-4 text-xs text-slate-500">{item.level}</td>
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

      <Modal
        open={showModal}
        title={editItem ? 'Edit Skill' : 'Add Skill'}
        submitLabel={editItem ? 'Update Skill' : 'Save Skill'}
        onClose={closeModal}
        onSubmit={handleSubmit}
      >
        <FormField label="Skill Name" required placeholder="e.g. React.js, Photoshop, Project Management" value={form.name} onChange={set('name')} />
        <FormField label="Category" required placeholder="e.g. Design, Development, Marketing" value={form.category} onChange={set('category')} />
        <FormField label="Proficiency Level" value={form.level} onChange={set('level')} options={['Beginner', 'Intermediate', 'Expert']} />
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
};

export default AdminSkills;
