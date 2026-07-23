/**
 * js/components/toast.js
 * Non-blocking toast notification. Max 1 visible at a time.
 * CSS lives in components.css (.toast, .toast-success, .toast-error, .toast-info)
 */

let _active = null;
let _timer  = null;

/**
 * Show a toast notification.
 * @param {'success'|'error'|'info'} type
 * @param {string} message
 * @param {number} [duration=3500]
 */
export function showToast(type = 'success', message, duration = 3500) {
  _clear();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  const ICONS = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  toast.innerHTML = `
    <i class="fas ${ICONS[type] ?? ICONS.info} toast-icon"></i>
    <p>${message}</p>
    <button class="toast-close" aria-label="Dismiss"><i class="fas fa-xmark"></i></button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', _clear);
  document.body.appendChild(toast);
  _active = toast;

  requestAnimationFrame(() => toast.classList.add('show'));
  _timer = setTimeout(_clear, duration);
}

function _clear() {
  clearTimeout(_timer);
  if (!_active) return;
  _active.classList.remove('show');
  const el = _active;
  setTimeout(() => el.remove(), 350);
  _active = null;
}
