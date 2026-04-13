const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
      <Icon size={16} className="text-violet-400" />
    </div>
    <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-heading)' }}>{title}</h2>
    <div className="flex-1 h-px ml-2" style={{ background: 'var(--color-border)' }} />
  </div>
);

export default SectionHeader;
