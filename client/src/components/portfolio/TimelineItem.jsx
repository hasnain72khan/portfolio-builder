const TimelineItem = ({ title, subtitle, dateRange, description, dotColor = 'bg-violet-400' }) => (
  <div className="rounded-2xl p-5 relative pl-8" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
    <div className={`absolute left-5 top-7 w-2 h-2 rounded-full ${dotColor}`} />
    <div className="flex items-start justify-between gap-4 mb-1">
      <div>
        <h3 className="font-bold text-sm" style={{ color: 'var(--color-heading)' }}>{title}</h3>
        <p className="text-xs font-medium" style={{ color: dotColor === 'bg-teal-400' ? '#2dd4bf' : '#a78bfa' }}>{subtitle}</p>
      </div>
      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)' }}>
        {dateRange}
      </span>
    </div>
    {description && <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--color-text-sub)' }}>{description}</p>}
  </div>
);

export default TimelineItem;
