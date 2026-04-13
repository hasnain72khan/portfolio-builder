import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ title, onAdd, addLabel = 'Add' }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 mb-8 animate-fade-in-up">
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors duration-200 text-sm"
      >
        <ArrowLeft size={18} /> Back
      </button>
      <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
      >
        <Plus size={16} /> {addLabel}
      </button>
    </div>
  );
};

export default AdminHeader;
