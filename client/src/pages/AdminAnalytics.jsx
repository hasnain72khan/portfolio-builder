import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Download, MessageSquare, TrendingUp } from 'lucide-react';
import api from '../api';

const StatBox = ({ icon: Icon, label, value, color }) => (
  <div className="glass rounded-2xl p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </div>
);

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/analytics/summary').then(r => setData(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#0f0f13' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors text-sm">
            <ArrowLeft size={18} /> Back
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">Portfolio Analytics</h2>
        </div>

        {!data ? (
          <div className="text-center py-20 text-slate-600">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatBox icon={Eye} label="Total Views" value={data.totalViews} color="#7c3aed" />
              <StatBox icon={TrendingUp} label="Last 7 Days" value={data.last7} color="#3b82f6" />
              <StatBox icon={Download} label="Resume Downloads" value={data.resumeDownloads} color="#10b981" />
              <StatBox icon={MessageSquare} label="Contact Clicks" value={data.contactClicks} color="#f59e0b" />
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Daily Views (Last 30 Days)</h3>
              {data.dailyViews.length === 0 ? (
                <p className="text-slate-600 text-sm text-center py-8">No views yet</p>
              ) : (
                <div className="flex items-end gap-1 h-40">
                  {data.dailyViews.map(d => {
                    const max = Math.max(...data.dailyViews.map(v => v.count), 1);
                    const h = (d.count / max) * 100;
                    return (
                      <div key={d._id} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div className="absolute -top-6 text-[10px] text-violet-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          {d.count}
                        </div>
                        <div
                          className="w-full rounded-t transition-all duration-300 group-hover:opacity-80"
                          style={{ height: `${Math.max(h, 4)}%`, background: 'linear-gradient(to top, rgba(124,58,237,0.3), rgba(124,58,237,0.8))' }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
