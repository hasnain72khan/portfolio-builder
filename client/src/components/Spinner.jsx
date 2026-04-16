/**
 * Reusable loading spinner.
 * @param {number} size - diameter in pixels (default 16)
 * @param {string} color - border color (default 'currentColor')
 */
const Spinner = ({ size = 16, color = 'currentColor' }) => (
  <div
    className="rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
    style={{ width: size, height: size, borderColor: color, borderTopColor: 'transparent' }}
  />
);

export default Spinner;
