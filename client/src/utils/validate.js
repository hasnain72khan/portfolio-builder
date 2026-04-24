/**
 * Form validation utilities.
 */

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isUrl = (v) => !v || /^https?:\/\/.+/.test(v);
export const isPhone = (v) => !v || /^[\+\d\s\-\(\)]{7,}$/.test(v);
export const isRequired = (v) => v && v.trim().length > 0;
export const minLength = (v, n) => v && v.trim().length >= n;

/**
 * Validate a form object against rules.
 * @param {Object} form - form data
 * @param {Object} rules - { fieldName: [{ test: fn, msg: string }] }
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateForm(form, rules) {
  const errors = {};
  for (const [field, checks] of Object.entries(rules)) {
    for (const { test, msg } of checks) {
      if (!test(form[field])) {
        errors[field] = msg;
        break;
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
