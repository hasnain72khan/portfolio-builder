import { Calendar } from 'lucide-react';

const DailyViewsChart = ({ dailyViews = [] }) => {
  const maxView = Math.max(...dailyViews.map(v => v.count), 1);

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Calendar size={14} /> Daily Views
        </h3>
        <span className="text-[10px] text-slate-600">Last 30 days</span>
      </div>
      {dailyViews.length === 0 ? (
        <p className="text-slate-600 text-sm text-center py-8">No views yet</p>
      ) : (
        <div>
          <div className="flex">
            <div className="flex flex-col justify-between text-[9px] text-slate-600 pr-2 h-40">
              <span>{maxView}</span>
              <span>{Math.round(maxView / 2)}</span>
              <span>0</span>
            </div>
            <div className="flex-1 flex items-end gap-[2px] h-40 border-l border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {dailyViews.map(d => {
                const h = (d.count / maxView) * 100;
                const date = new Date(d._id);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                return (
                  <div key={d._id} className="flex-1 flex flex-col items-center group relative">
                    <div className="absolute -top-7 px-1.5 py-0.5 rounded text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap"
                      style={{ background: '#7c3aed', color: '#fff' }}>
                      {d.count} views · {date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="w-full rounded-t-sm transition-all duration-300 group-hover:opacity-80 cursor-pointer"
                      style={{
                        height: `${Math.max(h, 3)}%`,
                        background: isWeekend
                          ? 'linear-gradient(to top, rgba(99,102,241,0.2), rgba(99,102,241,0.5))'
                          : 'linear-gradient(to top, rgba(124,58,237,0.3), rgba(124,58,237,0.8))',
                      }} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex ml-6 mt-1">
            {dailyViews.map((d, i) => (
              <div key={d._id} className="flex-1 text-center">
                {i === 0 || i === dailyViews.length - 1 || i === Math.floor(dailyViews.length / 2) ? (
                  <span className="text-[8px] text-slate-600">{new Date(d._id).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyViewsChart;
