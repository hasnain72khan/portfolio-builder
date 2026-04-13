const AdminLayout = ({ children }) => (
  <div className="min-h-screen p-6 md:p-8 overflow-y-auto" style={{ background: '#0f0f13' }}>
    <div className="max-w-6xl mx-auto">
      {children}
    </div>
  </div>
);

export default AdminLayout;
