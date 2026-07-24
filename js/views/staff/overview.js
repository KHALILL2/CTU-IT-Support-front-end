/**
 * js/views/staff/overview.js
 * Staff dashboard overview — shows stats and quick actions.
 */
import { withSkeleton } from '../../components/skeleton.js';
import { showToast } from '../../components/toast.js';
import { getToday } from '../../api/attendance.js';
import { getActiveMeetings } from '../../api/meetings.js';
import { getRole } from '../../utils/jwt.js';

export async function render(container) {
  const role = getRole();
  const isLab = role === 'lab_supervisor';
  const isIT  = role === 'it_support';

  container.innerHTML = '';
  const content = document.createElement('div');
  container.appendChild(content);

  const fetchAndRender = async () => {
    let todayAtt = { signed: false };
    let activeMeetings = 0;

    try {
      todayAtt = await getToday();
    } catch { /* mock fallback */ }

    try {
      const meetings = await getActiveMeetings();
      activeMeetings = meetings.length;
    } catch { /* mock fallback */ }

    content.innerHTML = '';

    // Stats Grid
    const grid = document.createElement('div');
    grid.className = 'stats-grid';

    const stats = [
      { icon: 'fa-calendar-check', label: 'Attendance', value: todayAtt.signed ? '✅ Checked In' : '⏳ Pending', colorClass: 'primary' },
      { icon: 'fa-video', label: 'Active Meetings', value: activeMeetings, colorClass: 'success' },
      { icon: 'fa-exclamation-triangle', label: 'Open Issues', value: '—', colorClass: 'warning' },
      { icon: 'fa-boxes-stacked', label: 'Custody Items', value: '—', colorClass: 'primary' },
    ];

    stats.forEach(s => {
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
      grid.appendChild(card);
    });

    content.appendChild(grid);

    // Quick Actions
    const actionsCard = document.createElement('div');
    actionsCard.className = 'card';
    actionsCard.style.cssText = 'padding: 1.5rem; margin-top: 1.5rem;';

    const actionsTitle = document.createElement('h4');
    actionsTitle.style.cssText = 'margin-bottom: 1rem; border-bottom: 1px solid var(--border-default); padding-bottom: 0.5rem;';
    actionsTitle.textContent = 'Quick Actions';
    actionsCard.appendChild(actionsTitle);

    const actionsRow = document.createElement('div');
    actionsRow.style.cssText = 'display: flex; gap: 1rem; flex-wrap: wrap;';

    const actions = [
      { hash: '#attendance', icon: 'fa-map-marker-alt', label: 'Check In', cls: 'btn-primary' },
      { hash: '#issues', icon: 'fa-plus', label: 'Report Issue', cls: 'btn-secondary' },
      { hash: '#custody', icon: 'fa-boxes-stacked', label: 'My Custody', cls: 'btn-secondary' },
    ];

    if (isLab) {
      actions.push({ hash: '#reports', icon: 'fa-file-alt', label: 'Submit Report', cls: 'btn-secondary' });
    }

    actions.forEach(a => {
      const link = document.createElement('a');
      link.href = a.hash;
      link.className = `btn ${a.cls}`;
      link.style.cssText = 'display: inline-flex; align-items: center; gap: 0.5rem;';
      const icon = document.createElement('i');
      icon.className = `fas ${a.icon}`;
      link.appendChild(icon);
      link.appendChild(document.createTextNode(` ${a.label}`));
      actionsRow.appendChild(link);
    });

    actionsCard.appendChild(actionsRow);
    content.appendChild(actionsCard);
  };

  await withSkeleton(content, 3, fetchAndRender());

  return () => {};
}
