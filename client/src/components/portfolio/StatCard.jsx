const StatCard = ({ value, label }) => (
  <div className="text-center py-4 rounded-xl" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
    <p className="text-2xl font-extrabold text-violet-400">{value}</p>
    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
  </div>
);

export default StatCard;
