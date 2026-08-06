/* ============================================
   CTU Support — Global App Logic
   Theme toggle, language toggle, navbar/footer injection,
   scroll animations, loading screen
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Init language early if possible
  initLanguage();

  // --- Modal Logic ---
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('.modal-close, [data-modal-close]');
  const modals = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.querySelector(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = (modal) => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(closeBtn.closest('.modal-overlay'));
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  initTheme();
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
  const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'en';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
  
  // Apply translations after a tick to ensure DOM is ready
  setTimeout(() => {
    if (typeof applyTranslations === 'function') {
      applyTranslations();
    }
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
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }
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
    if (typeof toggleLanguage !== 'undefined') {
      langBtn.addEventListener('click', toggleLanguage);
    }
    // Set initial text
    const langText = langBtn.querySelector('.lang-text');
    if (langText) {
      const currentLang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'en';
      langText.textContent = currentLang === 'ar' ? 'EN' : 'عربي';
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
      btn.textContent = typeof t === 'function' ? t('report.copied') : 'Copied!';
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
      btn.textContent = typeof t === 'function' ? t('report.copied') : 'Copied!';
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
  const currentLang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'en';
  return date.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', {
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

/* ========================
   DATA IMPORT SIMULATION
   ======================== */

/**
 * Simulates importing data from Excel/CSV and injecting it into a target table.
 * @param {string} fileType - 'excel', 'csv', or 'data'
 * @param {string} targetTableId - ID or selector of the tbody to inject into
 * @param {HTMLElement} btn - The button that triggered the import
 */
window.simulateDataImport = function(fileType, targetTableId, btn) {
  // Store original button state
  const originalText = btn.innerHTML;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Importing...`;
  btn.disabled = true;

  /* 
   * [BACKEND HINT] 
   * PHP DEVELOPERS: The static JSON below ('dummyData') represents the expected data format.
   * To make this dynamic:
   * 1. Create a PHP script (e.g., 'import_data.php') that parses the uploaded CSV/Excel file.
   * 2. Have the PHP script return JSON encoded data (`echo json_encode($parsedData);`).
   * 3. Replace the 'dummyData' variable below with a `fetch('import_data.php')` call.
   * 4. Or, pass the JSON directly from PHP on page load and trigger this function.
   */
  const dummyData = [
    {
      id: "ID-" + Math.floor(Math.random() * 10000),
      name: "Imported User/Record A",
      role: "Student",
      date: new Date().toISOString().split('T')[0],
      status: "Active"
    },
    {
      id: "ID-" + Math.floor(Math.random() * 10000),
      name: "Imported User/Record B",
      role: "Staff",
      date: new Date().toISOString().split('T')[0],
      status: "Pending"
    }
  ];

  // Simulate network delay
  setTimeout(() => {
    const tbody = document.querySelector(targetTableId);
    if (tbody) {
      // Loop through dummyData and inject rows
      dummyData.forEach(row => {
        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'rgba(16, 185, 129, 0.1)'; // Highlight new rows slightly
        tr.innerHTML = `
          <td><strong>${row.id}</strong></td>
          <td>${row.name}</td>
          <td>${row.role}</td>
          <td>${row.date}</td>
          <td><span class="badge badge-success">${row.status}</span></td>
          <td>
            <button class="btn-icon" title="View"><i class="fas fa-eye"></i></button>
            <button class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
          </td>
        `;
        tbody.prepend(tr);
        
        // Remove highlight after 2s
        setTimeout(() => {
          tr.style.transition = 'background-color 1s ease';
          tr.style.backgroundColor = '';
        }, 2000);
      });
      
      showToast(`Successfully imported ${dummyData.length} records from ${fileType.toUpperCase()}`, 'success');
    } else {
      showToast(`Error: Target table ${targetTableId} not found.`, 'error');
    }

    // Restore button state
    btn.innerHTML = originalText;
    btn.disabled = false;
  }, 1500);
};

/* ========================
   GLOBAL DATA EXPORT
   ======================== */

/* [BACKEND HINT]:
   The following frontend JS function simulates the export process.
   For true Excel, CSV, and PDF exports, you MUST move this logic to the backend 
   PHP server (e.g., using PhpSpreadsheet for Excel/CSV, and TCPDF/MPDF for PDF)
   to ensure data security and handle large datasets securely.
   The PNG export can remain partially on the frontend (e.g., using html2canvas) 
   but is mocked here for the prototype.
*/
window.exportTableData = function(format, tableId, btn) {
  // Store original button text/icon to restore later
  const originalText = btn.innerHTML;
  
  // Set loading state
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Exporting...`;
  btn.disabled = true;

  // Simulate generation delay
  setTimeout(() => {
    let message = '';
    
    if (format === 'png') {
      // Simulate html2canvas snapshot
      message = `Table snapshot captured! Saved as table_export.png`;
    } else {
      // Simulate server-side generation
      message = `Successfully exported table data as ${format.toUpperCase()}`;
    }
    
    showToast(message, 'success');

    // Restore button state
    btn.innerHTML = originalText;
    btn.disabled = false;
  }, 1200); // 1.2s delay for simulation
};
