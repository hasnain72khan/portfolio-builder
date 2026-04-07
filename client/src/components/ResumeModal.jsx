import { X, FileText, Columns2 } from 'lucide-react';
import generateResumePDF from '../utils/generateResumePDF';
import generateResumeTwoCol from '../utils/generateResumeTwoCol';

const ResumeModal = ({ open, onClose, data }) => {
  if (!open) return null;

  const handleDownload = (type) => {
    if (type === 'one') {
      generateResumePDF(data);
    } else {
      generateResumeTwoCol(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="rounded-2xl w-full max-w-sm overflow-hidden animate-slide-up"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex justify-between items-center px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="text-base font-bold" style={{ color: 'var(--color-heading)' }}>Choose Resume Layout</h3>
          <button onClick={onClose} className="p-1 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--glass-bg)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <X size={18} />
          </button>
        </div>

        <div className="p-5 grid grid-cols-2 gap-3">
          {/* One Column */}
          <button onClick={() => handleDownload('one')}
            className="group flex flex-col items-center gap-3 p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--glass-border)')}>
            <div className="w-12 h-16 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <FileText size={22} className="text-violet-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>One Column</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Classic layout</p>
            </div>
          </button>

          {/* Two Column */}
          <button onClick={() => handleDownload('two')}
            className="group flex flex-col items-center gap-3 p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--glass-border)')}>
            <div className="w-12 h-16 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <Columns2 size={22} className="text-violet-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>Two Column</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Modern layout</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
