const StatCard = ({ value, label }) => (
  <div className="text-center py-4 rounded-xl" style={{ background: 'rgba(var(--brand-rgb), 0.08)', border: '1px solid rgba(var(--brand-rgb), 0.15)' }}>
    <p className="text-2xl font-extrabold" style={{ color: 'var(--color-brand)' }}>{value}</p>
    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
  </div>
);

export default StatCard;
