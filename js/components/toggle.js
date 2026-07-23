/**
 * js/components/toggle.js
 * Generates a toggle switch element.
 * CSS: .toggle-switch, .toggle-input, .toggle-slider in components.css
 */

/**
 * Creates a toggle switch.
 * @param {boolean} checked - Initial state.
 * @param {Function} [onChange] - Callback fired with (boolean) on state change.
 * @returns {HTMLLabelElement}
 */
export function createToggle(checked = false, onChange = null) {
  const label = document.createElement('label');
  label.className = 'toggle-switch';
  
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'toggle-input';
  input.checked = checked;
  
  if (onChange) {
    input.addEventListener('change', (e) => onChange(e.target.checked));
  }
  
  const slider = document.createElement('span');
  slider.className = 'toggle-slider';
  
  label.appendChild(input);
  label.appendChild(slider);
  
  return label;
}
