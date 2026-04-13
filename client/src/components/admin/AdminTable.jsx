const AdminTable = ({ columns, children, emptyText = 'No data yet.' }) => (
  <div className="glass rounded-2xl overflow-x-auto animate-fade-in-up" style={{ animationDelay: '80ms' }}>
    <table className="w-full text-left min-w-[600px]">
      <thead>
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {columns.map((col, i) => (
            <th
              key={col}
              className={`px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 ${
                i === columns.length - 1 ? 'text-right' : ''
              }`}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {children}
        {(!children || (Array.isArray(children) && children.length === 0)) && (
          <tr>
            <td colSpan={columns.length} className="px-5 py-12 text-center text-slate-600 text-sm">
              {emptyText}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default AdminTable;
