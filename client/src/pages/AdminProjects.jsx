import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import { AdminLayout, AdminHeader, AdminTable, TableRow, TableActions, Modal, FormField } from '../components/admin';

const AdminProjects = () => {
  const [data, setData]           = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast]         = useState(null);
  const [form, setForm]           = useState({ title: '', pageType: '', description: '', image: '', techStack: '', liveLink: '', githubLink: '' });
  const [saving, setSaving]       = useState(false);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const perPage = 10;

  const showToast = (msg, type = 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const fetchData = (p) => {
    api.get(`/projects?page=${p}&limit=${perPage}`)
      .then(r => { setData(r.data.data || []); setTotalPages(r.data.totalPages || 1); setTotal(r.data.total || 0); })
      .catch(() => showToast('Failed to load projects.'));
  };

  useEffect(() => { fetchData(1); }, []);

  const handlePageChange = (p) => { setPage(p); fetchData(p); };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setConfirmId(null);
      showToast('Project deleted.', 'success');
      const p = data.length === 1 && page > 1 ? page - 1 : page;
      setPage(p); fetchData(p);
    } catch { showToast('Delete failed.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      techStack: typeof form.techStack === 'string' ? form.techStack.split(',').map(s => s.trim()).filter(Boolean) : form.techStack,
    };
    try {
      if (editItem) {
        await api.put(`/projects/${editItem._id}`, payload);
        showToast('Project updated.', 'success');
      } else {
        await api.post('/projects', payload);
        showToast('Project added.', 'success');
      }
      closeModal();
      fetchData(editItem ? page : 1);
      if (!editItem) setPage(1);
    } catch { showToast(editItem ? 'Failed to update.' : 'Failed to add project.'); } finally { setSaving(false); }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ title: item.title || '', pageType: item.pageType || '', description: item.description || '', image: item.image || '', techStack: item.techStack?.join(', ') || '', liveLink: item.liveLink || '', githubLink: item.githubLink || '' });
    setShowModal(true);
  };

  const openAdd = () => { setEditItem(null); setForm({ title: '', pageType: '', description: '', image: '', techStack: '', liveLink: '', githubLink: '' }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  return (
    <AdminLayout>
      <AdminHeader title="Project Management" addLabel="Add Project" onAdd={openAdd} />

      <AdminTable columns={['Project Title', 'Page Type', 'Tech Stack', 'Actions']} emptyText="No projects yet. Add one above.">
        {data.map(item => (
          <TableRow key={item._id}>
            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-200 text-sm">{item.title}</span>
                {item.liveLink && <ExternalLink size={13} className="text-slate-600" />}
              </div>
            </td>
            <td className="px-5 py-4">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30">
                {item.pageType}
              </span>
            </td>
            <td className="px-5 py-4 text-slate-500 text-xs">{item.techStack?.join(', ')}</td>
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

      <Modal open={showModal} title={editItem ? 'Edit Project' : 'Add New Project'} submitLabel={editItem ? 'Update Project' : 'Save Project'} onClose={closeModal} onSubmit={handleSubmit} saving={saving}>
        <FormField label="Project Title" required placeholder="e.g. Portfolio Website, Mobile App, Brand Identity" value={form.title} onChange={set('title')} />
        <FormField label="Project Type" placeholder="e.g. Web App, Mobile App, Landing Page, Logo Design, E-commerce" value={form.pageType} onChange={set('pageType')} />
        <FormField label="Tools / Tech Stack" placeholder="e.g. React, Figma, Photoshop, Node.js, WordPress (comma separated)" value={form.techStack} onChange={set('techStack')} />
        <FormField label="Description" required rows={3} placeholder="Briefly describe what this project is about..." value={form.description} onChange={set('description')} />
        <FormField label="Project Image URL" type="url" placeholder="https://example.com/screenshot.png (optional)" value={form.image} onChange={set('image')} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Live URL" type="url" placeholder="https://example.com" value={form.liveLink} onChange={set('liveLink')} />
          <FormField label="GitHub URL" type="url" placeholder="https://github.com/..." value={form.githubLink} onChange={set('githubLink')} />
        </div>
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
};

export default AdminProjects;
