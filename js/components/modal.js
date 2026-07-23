/**
 * js/components/modal.js
 * Handles modal dialogs using existing HTML structure.
 * CSS: .modal-overlay, .modal, .modal-close in components.css
 */

let activeModal = null;

/**
 * Mounts and opens a modal with custom content.
 * @param {HTMLElement|string} content - HTML string or DOM node.
 * @param {string} [title]             - Optional title for the modal header.
 */
export function openModal(content, title = '') {
  closeModal(); // Ensure any existing is closed
  
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.onclick = closeModal;
  
  modal.appendChild(closeBtn);

  if (title) {
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `<h3>${title}</h3>`;
    modal.appendChild(header);
  }
  
  const body = document.createElement('div');
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else {
    body.appendChild(content);
  }
  modal.appendChild(body);
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  activeModal = overlay;
  
  // Close on outside click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  
  // Focus Trap & Escape key
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) {
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    setTimeout(() => first.focus(), 50); // Focus after render
    
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      } else if (e.key === 'Escape') {
        closeModal();
      }
    });
  } else {
    overlay.setAttribute('tabindex', '-1');
    setTimeout(() => overlay.focus(), 50);
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }
  
  // Trigger entry animation
  requestAnimationFrame(() => overlay.classList.add('active'));
}

/**
 * Closes and removes the currently active modal.
 */
export function closeModal() {
  if (activeModal) {
    const el = activeModal;
    el.classList.remove('active');
    setTimeout(() => el.remove(), 300); // Wait for transition
    activeModal = null;
  }
}
