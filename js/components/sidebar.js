/**
 * js/components/sidebar.js
 * Reusable sidebar component — pure function, no fetch calls.
 *
 * Dynamically builds sidebar DOM using document.createElement.
 * Conditionally renders nav links based on the user's role.
 *
 * @param {object}   opts
 * @param {string}   opts.role          - 'admin' | 'lab_supervisor' | 'it_support'
 * @param {string}   opts.userName      - Display name
 * @param {string}   opts.userRoleLabel - e.g. 'Administrator', 'Lab Supervisor'
 * @param {string}   [opts.avatarSrc]   - Avatar image URL
 * @param {function} opts.onLogout      - Callback when logout is clicked
 * @returns {{ el: HTMLElement, destroy: function }}
 */
export function createSidebar({ role, userName, userRoleLabel, avatarSrc, onLogout }) {

  // ── Nav link definitions per role ──────────────────────────────────────
  const NAV_ITEMS = [
    { hash: '#overview',   icon: 'fa-th-large',            label: 'Dashboard',   roles: ['admin', 'lab_supervisor', 'it_support'] },
    { hash: '#users',      icon: 'fa-users',               label: 'Users',       roles: ['admin'] },
    { hash: '#attendance', icon: 'fa-calendar-check',      label: 'Attendance',  roles: ['admin', 'lab_supervisor', 'it_support'] },
    { hash: '#issues',     icon: 'fa-exclamation-triangle', label: 'Issues',     roles: ['admin', 'lab_supervisor', 'it_support'] },
    { hash: '#custody',    icon: 'fa-boxes-stacked',       label: 'Custody',     roles: ['admin', 'lab_supervisor', 'it_support'] },
    { hash: '#reports',    icon: 'fa-file-alt',            label: 'Reports',     roles: ['admin', 'lab_supervisor'] },
    { hash: '#audit',      icon: 'fa-shield-alt',          label: 'Audit Log',   roles: ['admin'] },
    { hash: '#profile',    icon: 'fa-user',                label: 'Profile',     roles: ['lab_supervisor', 'it_support'] },
  ];

  // ── Logo color per role ────────────────────────────────────────────────
  const LOGO_STYLES = {
    admin:          'background: linear-gradient(135deg, #DC2626, #F59E0B)',
    lab_supervisor: 'background: linear-gradient(135deg, #0D9488, #22C55E)',
    it_support:     'background: var(--gradient-primary)',
  };

  const LOGO_LETTERS = {
    admin:          'A',
    lab_supervisor: 'L',
    it_support:     'IT',
  };

  const PANEL_LABELS = {
    admin:          'Admin Panel',
    lab_supervisor: 'Lab Supervisor',
    it_support:     'IT Support',
  };

  // ── Build DOM ──────────────────────────────────────────────────────────
  const aside = document.createElement('aside');
  aside.className = 'sidebar';
  aside.id = 'sidebar';

  // Header
  const header = document.createElement('div');
  header.className = 'sidebar-header';

  const logo = document.createElement('div');
  logo.className = 'sidebar-logo';
  logo.setAttribute('style', LOGO_STYLES[role] || LOGO_STYLES.it_support);
  logo.textContent = LOGO_LETTERS[role] || 'C';

  const headerInfo = document.createElement('div');
  const brandH4 = document.createElement('h4');
  brandH4.setAttribute('data-i18n', 'nav.brand');
  brandH4.textContent = 'CTU Support';
  const panelSpan = document.createElement('span');
  panelSpan.textContent = PANEL_LABELS[role] || 'Dashboard';

  headerInfo.appendChild(brandH4);
  headerInfo.appendChild(panelSpan);
  header.appendChild(logo);
  header.appendChild(headerInfo);
  aside.appendChild(header);

  // Nav
  const nav = document.createElement('nav');
  nav.className = 'sidebar-nav';

  const section = document.createElement('div');
  section.className = 'sidebar-nav-section';

  const sectionTitle = document.createElement('div');
  sectionTitle.className = 'sidebar-nav-section-title';
  sectionTitle.textContent = 'Navigation';
  section.appendChild(sectionTitle);

  const filteredItems = NAV_ITEMS.filter(item => item.roles.includes(role));

  filteredItems.forEach(item => {
    const link = document.createElement('a');
    link.href = item.hash;
    link.className = 'sidebar-link';

    const icon = document.createElement('i');
    icon.className = `fas ${item.icon}`;

    const span = document.createElement('span');
    span.textContent = item.label;

    link.appendChild(icon);
    link.appendChild(span);
    section.appendChild(link);
  });

  nav.appendChild(section);
  aside.appendChild(nav);

  // Footer
  const footer = document.createElement('div');
  footer.className = 'sidebar-footer';

  const logoutLink = document.createElement('a');
  logoutLink.href = '#';
  logoutLink.className = 'sidebar-link';
  logoutLink.id = 'logout-btn';
  logoutLink.style.color = 'var(--danger-500)';

  const logoutIcon = document.createElement('i');
  logoutIcon.className = 'fas fa-right-from-bracket';
  const logoutSpan = document.createElement('span');
  logoutSpan.setAttribute('data-i18n', 'dash.sidebar.logout');
  logoutSpan.textContent = 'Logout';

  logoutLink.appendChild(logoutIcon);
  logoutLink.appendChild(logoutSpan);

  const logoutHandler = (e) => {
    e.preventDefault();
    if (typeof onLogout === 'function') onLogout();
  };
  logoutLink.addEventListener('click', logoutHandler);

  footer.appendChild(logoutLink);

  // User info
  const userBlock = document.createElement('div');
  userBlock.className = 'sidebar-user';

  const avatarWrap = document.createElement('div');
  avatarWrap.className = 'sidebar-user-avatar';
  const avatarImg = document.createElement('img');
  avatarImg.src = avatarSrc || '';
  avatarImg.alt = userName || '';
  avatarImg.id = 'sidebar-avatar';
  avatarWrap.appendChild(avatarImg);

  const userInfo = document.createElement('div');
  userInfo.className = 'sidebar-user-info';
  const nameH5 = document.createElement('h5');
  nameH5.id = 'sidebar-name';
  nameH5.textContent = userName || '';
  const roleSpan = document.createElement('span');
  roleSpan.id = 'sidebar-role';
  roleSpan.textContent = userRoleLabel || '';

  userInfo.appendChild(nameH5);
  userInfo.appendChild(roleSpan);

  userBlock.appendChild(avatarWrap);
  userBlock.appendChild(userInfo);
  footer.appendChild(userBlock);

  aside.appendChild(footer);

  // ── Cleanup ────────────────────────────────────────────────────────────
  function destroy() {
    logoutLink.removeEventListener('click', logoutHandler);
    aside.remove();
  }

  return { el: aside, destroy };
}
