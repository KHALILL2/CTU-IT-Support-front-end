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

const THEME_ICONS = {
  dark: `<svg class="theme-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  light: `<svg class="theme-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
};

let _lastThemeToggleTime = 0;
let _lastLangToggleTime = 0;

function getCurrentTheme() {
  return localStorage.getItem('ctu-theme') || localStorage.getItem('theme') || 'light';
}

function setTheme(theme) {
  const isDark = theme === 'dark';
  localStorage.setItem('ctu-theme', theme);
  localStorage.setItem('theme', theme);

  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark-theme', isDark);
  document.documentElement.classList.toggle('dark-mode', isDark);

  if (document.body) {
    document.body.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('dark-mode', isDark);
  }

  updateThemeIcon(theme);
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

function initTheme() {
  const savedTheme = getCurrentTheme();
  setTheme(savedTheme);
}

function toggleTheme(e) {
  if (e && e.preventDefault) e.preventDefault();
  const now = Date.now();
  if (now - _lastThemeToggleTime < 250) return;
  _lastThemeToggleTime = now;

  const current = getCurrentTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  const isDark = theme === 'dark';

  const icon = themeBtn.querySelector('i');
  if (icon) {
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  } else {
    themeBtn.innerHTML = THEME_ICONS[isDark ? 'dark' : 'light'];
  }

  themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeBtn.setAttribute('title', isDark ? 'Light Mode' : 'Dark Mode');
}

/* ========================
   LANGUAGE MANAGEMENT
   ======================== */

function getCurrentLang() {
  return localStorage.getItem('ctu-lang') || localStorage.getItem('language') || 'en';
}

function setLanguage(lang) {
  const isAr = lang === 'ar';
  localStorage.setItem('ctu-lang', lang);
  localStorage.setItem('language', lang);

  const dir = isAr ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);

  if (document.body) {
    document.body.setAttribute('dir', dir);
    document.body.setAttribute('lang', lang);
  }

  updateLangToggle(lang);

  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }

  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

function initLanguage() {
  const lang = getCurrentLang();
  setLanguage(lang);
}

function toggleLanguage(e) {
  if (e && e.preventDefault) e.preventDefault();
  const now = Date.now();
  if (now - _lastLangToggleTime < 250) return;
  _lastLangToggleTime = now;

  const current = getCurrentLang();
  const next = current === 'ar' ? 'en' : 'ar';
  setLanguage(next);
}

function updateLangToggle(lang) {
  const langBtn = document.getElementById('lang-toggle');
  if (!langBtn) return;

  const currentLang = lang || getCurrentLang();
  const isAr = currentLang === 'ar';

  const pill = langBtn.querySelector('.lang-pill') || langBtn.querySelector('.lang-text');
  if (pill) {
    pill.textContent = isAr ? 'EN' : 'عربي';
  }

  langBtn.setAttribute('title', isAr ? 'Switch to English' : 'التبديل إلى العربية');
  langBtn.setAttribute('aria-label', isAr ? 'Switch to English' : 'التبديل إلى العربية');
  langBtn.setAttribute('dir', 'ltr');
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
    if (!themeBtn.dataset.listenerBound) {
      themeBtn.dataset.listenerBound = 'true';
      themeBtn.addEventListener('click', toggleTheme);
    }
  }

  // Language toggle
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    if (!langBtn.dataset.listenerBound) {
      langBtn.dataset.listenerBound = 'true';
      langBtn.addEventListener('click', toggleLanguage);
    }
    updateLangToggle();
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
window.getCurrentTheme = getCurrentTheme;
window.setTheme = setTheme;
window.initTheme = initTheme;
window.toggleTheme = toggleTheme;
window.updateThemeIcon = updateThemeIcon;

window.getCurrentLang = getCurrentLang;
window.setLanguage = setLanguage;
window.initLanguage = initLanguage;
window.toggleLanguage = toggleLanguage;
window.updateLangToggle = updateLangToggle;

/* ========================
   LANGUAGE TOGGLE UI
   ======================== */

function updateLangToggle() {
  const langBtn = document.getElementById('lang-toggle');
  if (!langBtn) return;
  const currentLang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'en';
  const isAr = currentLang === 'ar';
  // Update pill display: show what language will switch TO
  const pill = langBtn.querySelector('.lang-pill');
  if (pill) {
    pill.textContent = isAr ? 'EN' : 'عربي';
  }
  langBtn.setAttribute('title', isAr ? 'Switch to English' : 'التبديل إلى العربية');
  langBtn.setAttribute('dir', 'ltr');
}
window.updateLangToggle = updateLangToggle;

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

window.handleDataExport = function(exportFormat, dataContext, btn) {
  // Store original button text/icon to restore later
  let originalText = '';
  if (btn) {
    originalText = btn.innerHTML;
    // Set loading state
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Exporting...`;
    btn.disabled = true;
  }

  /* 
  =========================================
  [BACKEND HINT FOR PHP DEVELOPER]
  The data below is STATIC dummy data used for frontend simulation.
  To make this dynamic:
  1. Delete the static JSON variable below.
  2. Replace it with your dynamic PHP variable (e.g., echo json_encode($your_database_results);).
  3. The rest of the export logic will handle the formatted data automatically.
  =========================================
  */
  const dummyExportData = {
    'users': [
      { id: "STU-001", name: "Sara Mohamed", email: "sara@ctu.edu.eg", role: "Student" },
      { id: "STU-002", name: "Ahmed Ali", email: "ahmed@ctu.edu.eg", role: "Student" }
    ],
    'reports': [
      { id: "REP-101", date: "2026-08-01", status: "Resolved", issue: "Projector not working" },
      { id: "REP-102", date: "2026-08-02", status: "Pending", issue: "Network down in Lab 3" }
    ],
    'attendance': [
      { day: "Monday", date: "2026-08-03", present: 45, absent: 5 },
      { day: "Tuesday", date: "2026-08-04", present: 48, absent: 2 }
    ],
    'equipment': [
      { id: "EQ-001", name: "Dell OptiPlex", status: "Active" },
      { id: "EQ-002", name: "Epson Projector", status: "Maintenance" }
    ],
    'trainings': [
      { id: "TR-01", title: "Cybersecurity Basics", attendees: 20 },
      { id: "TR-02", title: "Network Troubleshooting", attendees: 15 }
    ]
  };

  const dataset = dummyExportData[dataContext] || [];

  // Simulate generation delay
  setTimeout(() => {
    let message = '';
    
    if (dataset.length > 0) {
      let content, mimeType, extension;

      if (exportFormat === 'csv' || exportFormat === 'excel') {
        const headers = Object.keys(dataset[0]).join(',');
        const rows = dataset.map(obj => Object.values(obj).join(',')).join('\n');
        content = headers + '\n' + rows;
        mimeType = 'text/csv;charset=utf-8;';
        extension = exportFormat === 'excel' ? 'csv' : 'csv'; // Using csv for excel mock
      } else if (exportFormat === 'pdf') {
        content = 'Dummy PDF content for ' + dataContext;
        mimeType = 'text/plain';
        extension = 'pdf';
      } else if (exportFormat === 'png') {
        content = 'Dummy PNG content for ' + dataContext;
        mimeType = 'text/plain';
        extension = 'png';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${dataContext}_export.${extension}`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message = `Successfully downloaded ${dataContext} as ${exportFormat.toUpperCase()}!`;
    } else {
      message = `No data available for ${dataContext}`;
    }
    
    showToast(message, 'success');

    // Restore button state
    if (btn) {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }, 1200); // 1.2s delay for simulation
};
