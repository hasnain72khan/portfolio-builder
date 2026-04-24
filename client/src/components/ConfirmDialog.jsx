import { AlertTriangle } from 'lucide-react';
import Spinner from './Spinner';

/**
 * Reusable confirm dialog for delete actions.
 * @param {boolean} open
 * @param {string} title
 * @param {string} message
 * @param {function} onConfirm
 * @param {function} onCancel
 * @param {boolean} loading
 */
const ConfirmDialog = ({ open, title = 'Confirm Delete', message = 'Are you sure? This cannot be undone.', onConfirm, onCancel, loading = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="rounded-2xl w-full max-w-sm p-6 animate-slide-up" style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h3 id="confirm-title" className="text-sm font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-medium text-slate-400 transition-all disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            {loading ? <Spinner size={16} color="#fff" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
