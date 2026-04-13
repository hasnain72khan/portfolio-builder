export const capitalizeName = (name) =>
  name ? name.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

export const groupSkillsByCategory = (skills) => {
  const map = new Map();
  for (const skill of skills) {
    if (!map.has(skill.category)) map.set(skill.category, []);
    map.get(skill.category).push(skill);
  }
  return map;
};

export const categoryColor = (cat) => {
  const colors = [
    { bg: 'rgba(var(--brand-rgb),0.15)', border: 'rgba(var(--brand-rgb),0.3)', text: 'var(--color-brand)' },
    { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.3)',  text: '#93c5fd' },
    { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.3)',  text: '#6ee7b7' },
    { bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.3)',   text: '#67e8f9' },
    { bg: 'rgba(244,63,94,0.15)',   border: 'rgba(244,63,94,0.3)',   text: '#fda4af' },
    { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.3)',  text: '#fcd34d' },
  ];
  let hash = 0;
  for (let i = 0; i < cat.length; i++) hash = cat.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export const levelDot = { Expert: 'var(--color-brand)', Intermediate: '#93c5fd', Beginner: '#64748b' };

export const updateMeta = (key, value, attr = 'name') => {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};
