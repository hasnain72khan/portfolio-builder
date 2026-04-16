import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Download, MessageSquare, TrendingUp, Globe } from 'lucide-react';
import api from '../api';
import { StatBox, DailyViewsChart, BarList } from '../components/analytics';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/analytics/summary').then(r => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f13' }}>
      <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#0f0f13' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors text-sm">
            <ArrowLeft size={18} /> Back
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">Portfolio Analytics</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatBox icon={Eye} label="Total Views" value={data.totalViews} color="#7c3aed" />
          <StatBox icon={TrendingUp} label="Last 7 Days" value={data.last7} sub={`${data.last30} in 30 days`} color="#3b82f6" />
          <StatBox icon={Download} label="Resume Downloads" value={data.resumeDownloads} color="#10b981" />
          <StatBox icon={MessageSquare} label="Contact Clicks" value={data.contactClicks} color="#f59e0b" />
        </div>

        <div className="mb-6">
          <DailyViewsChart dailyViews={data.dailyViews} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BarList
            icon={Globe} title="Top Referrers" items={data.topReferrers}
            emptyText="No referrer data yet"
            colorFn={() => 'linear-gradient(90deg, #7c3aed, #3b82f6)'}
          />
          <BarList
            icon={Download} title="Downloads by Format" items={data.downloadsByFormat}
            emptyText="No downloads yet"
            colorFn={(item) => ({ pdf: '#ef4444', docx: '#3b82f6' }[item._id] || '#7c3aed')}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
