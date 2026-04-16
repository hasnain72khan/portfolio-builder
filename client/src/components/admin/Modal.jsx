import { X } from 'lucide-react';
import Spinner from '../Spinner';

const Modal = ({ open, title, onClose, onSubmit, submitLabel = 'Save', saving = false, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
    >
      <div className="glass rounded-3xl w-full max-w-lg overflow-hidden animate-slide-up">
        <div
          className="flex justify-between items-center px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={22} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {children}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl font-bold text-white mt-2 flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            {saving ? <Spinner size={18} color="#fff" /> : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
