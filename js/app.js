/* ============================================
   CTU Support — Global App Logic
   Theme toggle, language toggle, navbar/footer injection,
   scroll animations, loading screen
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initLayout();
  initScrollReveal();
  hideLoadingScreen();
});

/* ========================
   THEME MANAGEMENT
   ======================== */

function initTheme() {
  const savedTheme = localStorage.getItem('ctu-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ctu-theme', next);
  updateThemeIcon(next);

  // Dispatch custom event for Chart.js theme updates
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next } }));
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    const icon = themeBtn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }
}

/* ========================
   LANGUAGE MANAGEMENT
   ======================== */

function initLanguage() {
  const lang = getCurrentLang();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
  
  // Apply translations after a tick to ensure DOM is ready
  setTimeout(() => {
    applyTranslations();
  }, 100);
}

/* ========================
   COMPONENT LOADER
   ======================== */

async function initLayout() {
  // Determine path prefix based on page depth
  const path = window.location.pathname;
  let prefix = '';
  if (path.includes('/lab-supervisor/') || path.includes('/admin/') || path.includes('/support/') ||
      path.includes('\\lab-supervisor\\') || path.includes('\\admin\\') || path.includes('\\support\\')) {
    prefix = '../';
  }

  // Initialize navbar interactions (mobile menu, theme toggle, lang toggle)
  initNavbar(prefix);
  updateThemeIcon(document.documentElement.getAttribute('data-theme') || 'light');
  
  // Apply translations for the static HTML
  applyTranslations();
}

/* ========================
   NAVBAR INITIALIZATION
   ======================== */

function initNavbar(prefix) {
  // Update nav link paths for subdirectory pages
  if (prefix) {
    document.querySelectorAll('.nav-link[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('../')) {
        link.setAttribute('href', prefix + href);
      }
    });
  }

  // Highlight active page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('href')?.split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      menuToggle.classList.toggle('open');
    });

    // Close menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
      });
    });
  }

  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Language toggle
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', toggleLanguage);
    // Set initial text
    const langText = langBtn.querySelector('.lang-text');
    if (langText) {
      langText.textContent = getCurrentLang() === 'ar' ? 'EN' : 'عربي';
    }
  }

  // Scroll effect — add shadow to navbar on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
    // Set initial state
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    }
  }
}

/* ========================
   SCROLL REVEAL (IntersectionObserver)
   ======================== */

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ========================
   LOADING SCREEN
   ======================== */

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
}

/* ========================
   UTILITY FUNCTIONS
   ======================== */

/**
 * Show a toast notification
 */
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <p>${message}</p>
  `;
  document.body.appendChild(toast);

  // Trigger show animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto-hide after 3s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = t('report.copied');
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('copied');
      }, 2000);
    }
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = t('report.copied');
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('copied');
      }, 2000);
    }
  }
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(getCurrentLang() === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Animate a number counter
 */
function animateCounter(element, target, duration = 1000) {
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(eased * target);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/**
 * Initialize dashboard sidebar toggle for mobile
 */
function initSidebar() {
  const toggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
  }

  // Highlight active sidebar link
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const linkPage = link.getAttribute('href')?.split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}

// Ensure toggle functions are available globally for inline handlers and module scripts
window.toggleTheme = toggleTheme;
if (typeof toggleLanguage !== 'undefined') {
  window.toggleLanguage = toggleLanguage;
}
