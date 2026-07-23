/**
 * js/components/emptyState.js
 * Generates an empty state DOM element.
 * CSS: .empty-state in components.css
 */

/**
 * Creates an empty state element.
 * @param {string} iconClass - FontAwesome icon class (e.g., 'fa-folder-open').
 * @param {string} title     - The title of the empty state.
 * @param {string} message   - The description message.
 * @returns {HTMLElement}
 */
export function createEmptyState(iconClass, title, message) {
  const el = document.createElement('div');
  el.className = 'empty-state';
  
  el.innerHTML = `
    <i class="fas ${iconClass}"></i>
    <h4>${title}</h4>
    <p>${message}</p>
  `;
  
  return el;
}
