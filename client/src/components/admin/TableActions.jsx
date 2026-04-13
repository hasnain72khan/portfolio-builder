import { Pencil, Trash2, AlertTriangle } from 'lucide-react';

const TableActions = ({ isConfirming, onEdit, onDelete, onConfirm, onCancel }) => (
  <td className="px-5 py-4 text-right">
    {isConfirming ? (
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <AlertTriangle size={12} className="text-amber-400" /> Sure?
        </span>
        <button
          onClick={onConfirm}
          className="text-xs px-2.5 py-1 rounded-lg text-red-300 transition-colors"
          style={{ background: 'rgba(239,68,68,0.15)' }}
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="text-xs px-2.5 py-1 rounded-lg text-slate-400 transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          No
        </button>
      </div>
    ) : (
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg text-slate-600 hover:text-violet-400 transition-colors duration-200"
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-slate-600 hover:text-red-400 transition-colors duration-200"
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Trash2 size={15} />
        </button>
      </div>
    )}
  </td>
);

export default TableActions;
