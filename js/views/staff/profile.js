/**
 * js/views/staff/profile.js
 * Profile & Warnings view for staff (both roles).
 * Shows personal info, stats, and received warnings.
 */
import { me } from '../../api/auth.js';
import { showToast } from '../../components/toast.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';
import { ROLE_LABELS } from '../../api/auth.js';

export async function render(container) {
  container.innerHTML = '';

  const content = document.createElement('div');
  container.appendChild(content);

  await withSkeleton(content, 3, (async () => {
    let user = null;
    try {
      user = await me();
    } catch {
      showToast('error', 'Failed to load profile');
      return;
    }

    if (!user) {
      content.appendChild(createEmptyState('fa-user', 'Profile Not Found', 'Could not load your profile data.'));
      return;
    }

    content.innerHTML = '';

    // ── Profile Header ─────────────────────────────────────────────────
    const profileHeader = document.createElement('div');
    profileHeader.className = 'profile-header';

    const avatar = document.createElement('div');
    avatar.className = 'profile-avatar';
    const avatarImg = document.createElement('img');
    avatarImg.src = user.avatar || '';
    avatarImg.alt = user.name || 'User';
    avatar.appendChild(avatarImg);
    profileHeader.appendChild(avatar);

    const nameH2 = document.createElement('h2');
    nameH2.textContent = user.name || '—';
    nameH2.style.color = 'var(--text-primary)';
    profileHeader.appendChild(nameH2);

    const roleP = document.createElement('p');
    roleP.className = 'text-muted';
    roleP.textContent = ROLE_LABELS[user.role] || user.role || '—';
    profileHeader.appendChild(roleP);

    content.appendChild(profileHeader);

    // ── Info Grid ───────────────────────────────────────────────────────
    const infoCard = document.createElement('div');
    infoCard.className = 'card';
    infoCard.style.cssText = 'padding: 1.5rem; margin-bottom: 1.5rem;';

    const infoTitle = document.createElement('h4');
    infoTitle.textContent = 'Personal Information';
    infoTitle.style.cssText = 'margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-default);';
    infoCard.appendChild(infoTitle);

    const infoGrid = document.createElement('div');
    infoGrid.className = 'detail-panel-fields';

    const infoFields = [
      { label: 'Full Name', value: user.name },
      { label: 'Email', value: user.email },
      { label: 'Department', value: user.department },
      { label: 'Role', value: ROLE_LABELS[user.role] || user.role },
      { label: 'Employee ID', value: user.id || '—' },
    ];

    infoFields.forEach(f => {
      const field = document.createElement('div');
      field.className = 'detail-field';
      const label = document.createElement('label');
      label.textContent = f.label;
      const p = document.createElement('p');
      p.textContent = f.value || '—';
      field.appendChild(label);
      field.appendChild(p);
      infoGrid.appendChild(field);
    });

    infoCard.appendChild(infoGrid);
    content.appendChild(infoCard);

    // ── Stats ───────────────────────────────────────────────────────────
    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats-grid';
    statsGrid.style.marginBottom = '1.5rem';

    const statItems = [
      { icon: 'fa-calendar-check', label: 'Attendance Rate', value: '—', colorClass: 'primary' },
      { icon: 'fa-wrench', label: 'Issues Resolved', value: '—', colorClass: 'success' },
      { icon: 'fa-boxes-stacked', label: 'Custody Items', value: '—', colorClass: 'warning' },
      { icon: 'fa-exclamation-circle', label: 'Warnings', value: '0', colorClass: 'danger' },
    ];

    statItems.forEach(s => {
      const card = document.createElement('div');
      card.className = 'stat-card';

      const iconDiv = document.createElement('div');
      iconDiv.className = `stat-card-icon ${s.colorClass}`;
      const i = document.createElement('i');
      i.className = `fas ${s.icon}`;
      iconDiv.appendChild(i);

      const info = document.createElement('div');
      info.className = 'stat-card-info';
      const h3 = document.createElement('h3');
      h3.textContent = s.value;
      const p = document.createElement('p');
      p.textContent = s.label;
      info.appendChild(h3);
      info.appendChild(p);

      card.appendChild(iconDiv);
      card.appendChild(info);
      statsGrid.appendChild(card);
    });

    content.appendChild(statsGrid);

    // ── Warnings Section ────────────────────────────────────────────────
    const warningsCard = document.createElement('div');
    warningsCard.className = 'card';
    warningsCard.style.cssText = 'padding: 1.5rem;';

    const warningsTitle = document.createElement('h4');
    warningsTitle.textContent = 'Warnings & Notices';
    warningsTitle.style.cssText = 'margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-default);';
    warningsCard.appendChild(warningsTitle);

    // Mock: no warnings
    const warningsEmpty = createEmptyState('fa-check-circle', 'No Warnings', 'You have no warnings or notices.');
    warningsCard.appendChild(warningsEmpty);

    content.appendChild(warningsCard);
  })());

  return () => {};
}
