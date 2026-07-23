/**
 * js/components/badge.js
 * Generates a badge DOM element.
 * CSS: .badge, .badge-pending, .badge-progress, .badge-done in components.css
 */

/**
 * Creates a badge element.
 * @param {string} label  - Text inside the badge.
 * @param {string} status - Maps to .badge-{status} (e.g. 'pending', 'progress', 'done').
 * @returns {HTMLElement}
 */
export function createBadge(label, status = 'pending') {
  const badge = document.createElement('span');
  badge.className = `badge badge-${status}`;
  badge.textContent = label;
  return badge;
}
