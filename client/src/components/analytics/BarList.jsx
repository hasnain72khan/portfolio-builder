/**
 * Reusable horizontal bar list component for analytics.
 * Used for Top Referrers and Downloads by Format.
 */
const BarList = ({ icon: Icon, title, items = [], emptyText = 'No data yet', colorFn }) => {
  const maxVal = items[0]?.count || 1;

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
        <Icon size={14} /> {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-slate-600 text-sm text-center py-6">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const pct = (item.count / maxVal) * 100;
            const color = colorFn ? colorFn(item, i) : '#7c3aed';
            let label = item._id || 'Unknown';
            try { label = new URL(item._id).hostname; } catch {}
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-300 truncate max-w-[70%]">{label}</span>
                  <span className="text-xs font-bold text-slate-400">{item.count}</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BarList;
