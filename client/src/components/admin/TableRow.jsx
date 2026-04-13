const TableRow = ({ children }) => (
  <tr
    className="transition-colors duration-150"
    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
  >
    {children}
  </tr>
);

export default TableRow;
