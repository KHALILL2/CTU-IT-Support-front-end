/**
 * js/components/skeleton.js
 * Animated placeholder skeletons for loading states.
 * CSS: .skeleton, .skeleton-text, .skeleton-circle, .skeleton-card in components.css
 */

/**
 * Create a skeleton placeholder element.
 * @param {'text'|'circle'|'card'|'row'} [variant='text']
 * @param {object} [opts]
 * @param {string} [opts.width]  - CSS width string, e.g. '80%'
 * @param {string} [opts.height] - CSS height string, e.g. '1rem'
 * @param {number} [opts.rows]   - Number of rows (variant='row' only)
 * @returns {HTMLElement}
 */
export function createSkeleton(variant = 'text', opts = {}) {
  const el = document.createElement('div');

  if (variant === 'row') {
    el.className = 'skeleton-row';
    const count = opts.rows ?? 3;
    for (let i = 0; i < count; i++) {
      const line = document.createElement('div');
      line.className = `skeleton skeleton-text`;
      line.style.width = i === count - 1 ? '60%' : '100%';
      el.appendChild(line);
    }
    return el;
  }

  el.className = `skeleton skeleton-${variant}`;
  if (opts.width)  el.style.width  = opts.width;
  if (opts.height) el.style.height = opts.height;
  return el;
}

/**
 * Replace a container's children with N skeleton rows, then restore on resolve.
 * @param {HTMLElement} container
 * @param {number}      count      - Number of skeleton rows to show.
 * @param {Promise}     promise    - When resolved/rejected, restores the content.
 */
export async function withSkeleton(container, count, promise) {
  const original = container.innerHTML;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    container.appendChild(createSkeleton('row', { rows: 2 }));
  }
  return await promise;
}
