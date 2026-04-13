import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, total, perPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div className="flex items-center justify-between mt-4 px-2 flex-wrap gap-3">
      <p className="text-xs text-slate-500">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === '...' ? (
              <span key={`dot-${i}`} className="px-1 text-slate-600 text-xs">...</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className="w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200"
                style={{
                  background: page === p ? 'rgba(124,58,237,0.25)' : 'var(--glass-bg)',
                  border: `1px solid ${page === p ? 'rgba(124,58,237,0.5)' : 'var(--glass-border)'}`,
                  color: page === p ? '#a78bfa' : '#64748b',
                }}
              >
                {p}
              </button>
            )
          )}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
