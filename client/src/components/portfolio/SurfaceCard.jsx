const SurfaceCard = ({ children, className = '', hoverable = false, ...props }) => (
  <div
    className={`rounded-2xl ${className}`}
    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    {...(hoverable ? {
      onMouseEnter: e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'),
      onMouseLeave: e => (e.currentTarget.style.borderColor = 'var(--color-border)'),
    } : {})}
    {...props}
  >
    {children}
  </div>
);

export default SurfaceCard;
