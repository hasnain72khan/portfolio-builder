import { createContext, useContext, useState, useEffect } from 'react';

const AdminThemeContext = createContext();

export const AdminThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('admin-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('admin-theme', isDark ? 'dark' : 'light');
    // Toggle light class on html for CSS overrides (.glass, select, etc.)
    const root = document.documentElement;
    isDark ? root.classList.remove('admin-light') : root.classList.add('admin-light');
  }, [isDark]);

  const toggle = () => setIsDark(d => !d);

  const theme = isDark ? {
    bg: '#0f0f13',
    surface: '#16161e',
    border: 'rgba(255,255,255,0.06)',
    text: '#e2e8f0',
    textMuted: '#64748b',
    heading: '#ffffff',
  } : {
    bg: '#f4f4f8',
    surface: '#ffffff',
    border: 'rgba(0,0,0,0.08)',
    text: '#374151',
    textMuted: '#9ca3af',
    heading: '#111827',
  };

  return (
    <AdminThemeContext.Provider value={{ isDark, toggle, theme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => useContext(AdminThemeContext);
