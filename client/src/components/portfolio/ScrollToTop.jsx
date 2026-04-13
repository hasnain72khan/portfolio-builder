import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = ({ targetId = 'portfolio-main' }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = targetId ? document.getElementById(targetId) : window;
    if (!el) return;
    const handleScroll = () => {
      const scrollTop = targetId ? el.scrollTop : window.scrollY;
      setShow(scrollTop > 400);
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [targetId]);

  if (!show) return null;

  return (
    <button
      onClick={() => {
        const el = targetId ? document.getElementById(targetId) : window;
        el?.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="fixed z-50 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
      style={{
        background: `linear-gradient(135deg, var(--color-brand, #7c3aed), rgba(var(--brand-rgb, 124,58,237), 0.8))`,
        boxShadow: `0 4px 20px rgba(var(--brand-rgb, 124,58,237), 0.4)`,
        bottom: '1.5rem',
        right: '5rem',
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={18} />
    </button>
  );
};

export default ScrollToTop;
