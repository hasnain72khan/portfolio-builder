import useScrollReveal from '../hooks/useScrollReveal';

const ScrollReveal = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useScrollReveal(0.12);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
