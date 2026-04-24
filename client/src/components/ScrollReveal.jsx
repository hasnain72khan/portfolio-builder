import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

/**
 * Lazy-loads and animates children when they scroll into view.
 * Children are not mounted until the section is near the viewport.
 */
const ScrollReveal = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useScrollReveal(0.05);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  if (visible && !hasBeenVisible) setHasBeenVisible(true);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        minHeight: hasBeenVisible ? 'auto' : '50px',
      }}
    >
      {hasBeenVisible ? children : null}
    </div>
  );
};

export default ScrollReveal;
