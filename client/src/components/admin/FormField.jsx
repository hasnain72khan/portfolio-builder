const inputCls = 'w-full rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 text-sm';
const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
const focusStyle = (e) => (e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.4)');
const blurStyle = (e) => (e.target.style.boxShadow = 'none');

const FormField = ({ label, type = 'text', placeholder, required, value, onChange, rows, options, children }) => (
  <div>
    {label && (
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
    )}
    {children ? (
      children
    ) : options ? (
      <select
        className={inputCls}
        style={inputStyle}
        value={value}
        onFocus={focusStyle}
        onBlur={blurStyle}
        onChange={onChange}
      >
        {options.map(opt => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    ) : rows ? (
      <textarea
        required={required}
        rows={rows}
        placeholder={placeholder}
        className={inputCls}
        style={inputStyle}
        value={value}
        onFocus={focusStyle}
        onBlur={blurStyle}
        onChange={onChange}
      />
    ) : (
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        className={inputCls}
        style={inputStyle}
        value={value}
        onFocus={focusStyle}
        onBlur={blurStyle}
        onChange={onChange}
      />
    )}
  </div>
);

// Export the style constants for custom use
FormField.inputCls = inputCls;
FormField.inputStyle = inputStyle;
FormField.focusStyle = focusStyle;
FormField.blurStyle = blurStyle;

export default FormField;
