import { useEffect, useState } from 'react';
import api from '../api';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import { AdminLayout, AdminHeader, AdminTable, TableRow, TableActions, Modal, FormField } from '../components/admin';

const ICON_OPTIONS = [
  'Code2', 'Layers', 'ShoppingBag', 'Globe', 'Zap',
  'Database', 'Smartphone', 'Settings', 'BarChart', 'Shield',
  'Palette', 'Camera', 'Music', 'PenTool', 'Megaphone',
  'Heart', 'BookOpen', 'Briefcase', 'Truck', 'Wrench',
  'Scissors', 'Film', 'Mic', 'TrendingUp', 'Award',
];

const AdminServices = () => {
  const [data, setData]           = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast]         = useState(null);
  const [form, setForm]           = useState({ title: '', description: '', icon: 'Code2', order: 0 });
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const perPage = 10;

  const showToast = (msg, type = 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const fetchData = (p) => {
    api.get(`/services?page=${p}&limit=${perPage}`)
      .then(r => { setData(r.data.data || []); setTotalPages(r.data.totalPages || 1); setTotal(r.data.total || 0); })
      .catch(() => showToast('Failed to load services.'));
  };

  useEffect(() => { fetchData(1); }, []);

  const handlePageChange = (p) => { setPage(p); fetchData(p); };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      setConfirmId(null);
      showToast('Service deleted.', 'success');
      const p = data.length === 1 && page > 1 ? page - 1 : page;
      setPage(p); fetchData(p);
    } catch { showToast('Delete failed.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/services/${editItem._id}`, form);
        showToast('Service updated.', 'success');
      } else {
        await api.post('/services', form);
        showToast('Service added.', 'success');
      }
      closeModal();
      fetchData(editItem ? page : 1);
      if (!editItem) setPage(1);
    } catch { showToast(editItem ? 'Failed to update.' : 'Failed to add service.'); }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ title: item.title || '', description: item.description || '', icon: item.icon || 'Code2', order: item.order || 0 });
    setShowModal(true);
  };

  const openAdd = () => { setEditItem(null); setForm({ title: '', description: '', icon: 'Code2', order: 0 }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  return (
    <AdminLayout>
      <AdminHeader title="Services Management" addLabel="Add Service" onAdd={openAdd} />

      <AdminTable columns={['Icon', 'Title', 'Description', 'Actions']} emptyText="No services yet. Add one above.">
        {data.map(item => (
          <TableRow key={item._id}>
            <td className="px-5 py-4">
              <span className="text-xs font-mono text-violet-400 px-2 py-1 rounded" style={{ background: 'rgba(124,58,237,0.1)' }}>
                {item.icon}
              </span>
            </td>
            <td className="px-5 py-4 font-medium text-slate-200 text-sm">{item.title}</td>
            <td className="px-5 py-4 text-slate-500 text-xs max-w-xs truncate">{item.description}</td>
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

      <Modal open={showModal} title={editItem ? 'Edit Service' : 'Add Service'} submitLabel={editItem ? 'Update Service' : 'Save Service'} onClose={closeModal} onSubmit={handleSubmit}>
        <FormField label="Service Title" required placeholder="e.g. Web Development, Graphic Design, Photography, Marketing" value={form.title} onChange={set('title')} />
        <FormField label="Description" required rows={3} placeholder="e.g. I create stunning visuals for brands, build responsive websites, manage social media campaigns..." value={form.description} onChange={set('description')} />
        <FormField label="Icon">
          <div className="flex flex-wrap gap-2 mb-2">
            {ICON_OPTIONS.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setForm(f => ({ ...f, icon }))}
                className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150"
                style={{
                  background: form.icon === icon ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${form.icon === icon ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: form.icon === icon ? '#a78bfa' : '#64748b',
                }}
              >
                {icon}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Or type a custom icon name (e.g. Stethoscope, Gavel, Dumbbell)"
            className={FormField.inputCls}
            style={FormField.inputStyle}
            value={form.icon}
            onFocus={FormField.focusStyle}
            onBlur={FormField.blurStyle}
            onChange={set('icon')}
          />
        </FormField>
        <FormField label="Display Order" type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
};

export default AdminServices;
