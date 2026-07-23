let routes = {};
let currentCleanup = null;
let viewContainer = null;

/**
 * Registers the available route map for this dashboard.
 * @param {Object} map - An object mapping hash fragments (e.g. 'overview') to async render functions.
 */
export function registerRoutes(map) {
  routes = map;
}

/**
 * Initializes the hash router.
 * @param {HTMLElement} container - The DOM element where views will be rendered.
 */
export async function initRouter(container) {
  viewContainer = container;
  
  window.addEventListener('hashchange', handleRoute);
  
  // Trigger initial route
  if (!window.location.hash) {
    window.location.hash = '#overview'; // Default route
  } else {
    handleRoute();
  }
}

/**
 * Handles hash change events, cleaning up old views and rendering new ones.
 */
async function handleRoute() {
  if (!viewContainer) return;
  
  const hash = window.location.hash || '#overview';
  const route = hash.substring(1); // remove '#'
  
  // Clean up previous view if it returned a cleanup function
  if (currentCleanup && typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }
  
  const renderFn = routes[route] || routes['overview'];
  
  if (renderFn) {
    try {
      currentCleanup = await renderFn(viewContainer);
    } catch (e) {
      console.error(`Error rendering route ${route}:`, e);
      viewContainer.innerHTML = `<div class="error" style="padding: 2rem; color: var(--danger-500);">Error loading view</div>`;
    }
  } else {
    viewContainer.innerHTML = `<div class="error" style="padding: 2rem;">View not found</div>`;
  }
  
  // Update sidebar active states
  updateSidebar(hash);
}

/**
 * Updates the active class on sidebar navigation links based on current hash.
 * @param {string} hash 
 */
function updateSidebar(hash) {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    // Skip logout button
    if (link.id === 'logout-btn') return;
    
    link.classList.remove('active');
    if (link.getAttribute('href') === hash) {
      link.classList.add('active');
    }
  });
}
