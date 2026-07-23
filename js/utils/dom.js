/**
 * js/utils/dom.js
 * DOM utility helpers — pure functions, no side effects.
 * 
 * These are extracted from the global functions in app.js:
 *   - animateCounter()  → was app.js:306
 *   - showToast()       → was app.js:228
 *   - copyToClipboard() → was app.js:256
 */

// ─── Counter Animation ───────────────────────────────────────────────────────

/**
 * Animate a numeric counter from 0 to target using easeOutCubic.
 * @param {HTMLElement} element  - The DOM element whose textContent is updated.
 * @param {number}      target   - The final number to animate to.
 * @param {number}     [duration=1000] - Animation duration in ms.
 */
export function animateCounter(element, target, duration = 1000) {
  if (!element) return;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    element.textContent = Math.floor(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

// ─── Toast Notifications ────────────────────────────────────────────────────

/**
 * Show a transient toast notification.
 * @param {string} message - The message to display.
 * @param {'success'|'error'|'info'} [type='success'] - Visual style.
 * @param {number} [duration=3000] - Auto-dismiss delay in ms.
 */
export function showToast(message, type = 'success', duration = 3000) {
  // Remove any existing toast
  document.querySelector('.toast')?.remove();

  const ICONS = { success: '✅', error: '❌', info: 'ℹ️' };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <span class="toast-icon">${ICONS[type] ?? ICONS.info}</span>
    <p>${message}</p>
  `;
  document.body.appendChild(toast);

  // Trigger show animation on next frame
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── Clipboard ──────────────────────────────────────────────────────────────

/**
 * Copy a string to the clipboard and optionally flash feedback on a button.
 * @param {string}          text         - Text to copy.
 * @param {HTMLElement|null} [btn=null]  - Button to flash "Copied!" on.
 * @param {string}          [copiedLabel='Copied!'] - Feedback text.
 * @returns {Promise<boolean>} Resolves true on success.
 */
export async function copyToClipboard(text, btn = null, copiedLabel = 'Copied!') {
  const flash = (el) => {
    if (!el) return;
    const original = el.textContent;
    el.textContent = copiedLabel;
    el.classList.add('copied');
    setTimeout(() => {
      el.textContent = original;
      el.classList.remove('copied');
    }, 2000);
  };

  try {
    await navigator.clipboard.writeText(text);
    flash(btn);
    return true;
  } catch {
    // Fallback for HTTP / older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    Object.assign(ta.style, { position: 'fixed', opacity: '0' });
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (ok) flash(btn);
    return ok;
  }
}

// ─── Scroll Reveal ──────────────────────────────────────────────────────────

/**
 * Attach an IntersectionObserver to all `.reveal*` elements.
 * Adds class `revealed` when each enters the viewport.
 */
export function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  els.forEach((el) => observer.observe(el));
}

// ─── Element Helpers ────────────────────────────────────────────────────────

/**
 * Safely get an element by ID. Throws a descriptive error in dev if missing.
 * @param {string} id
 * @returns {HTMLElement}
 */
export function getById(id) {
  const el = document.getElementById(id);
  if (!el && window.CTU_CONFIG?.DEBUG_MODE !== false) {
    console.warn(`[dom] Element #${id} not found.`);
  }
  return el;
}

/**
 * Set the text content of an element by ID, safely.
 * @param {string} id
 * @param {string|number} text
 */
export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
