import { X } from 'lucide-react';

const Toast = ({ msg, type = 'error', onClose }) => {
  if (!msg) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl animate-toast-in max-w-sm"
      style={{
        background: type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
        border: `1px solid ${type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <span className={`text-sm font-medium ${type === 'error' ? 'text-red-300' : 'text-emerald-300'}`}>{msg}</span>
      <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
