/**
 * js/views/admin/audit.js
 * Security Audit Log — timeline of system actions.
 */
import { getAuditLog } from '../../api/audit.js';
import { showToast } from '../../components/toast.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';
import { createBadge } from '../../components/badge.js';

export async function render(container) {
  container.innerHTML = '';

  // ── Header ─────────────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'flex-between mb-3';
  const headerLeft = document.createElement('div');
  const h3 = document.createElement('h3');
  h3.textContent = 'Audit Log';
  h3.style.marginBottom = '0.25rem';
  const desc = document.createElement('p');
  desc.className = 'text-muted';
  desc.textContent = 'System activity timeline';
  headerLeft.appendChild(h3);
  headerLeft.appendChild(desc);
  header.appendChild(headerLeft);
  container.appendChild(header);

  // ── Filters ────────────────────────────────────────────────────────────
  const filterRow = document.createElement('div');
  filterRow.style.cssText = 'display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;';

  const userInput = document.createElement('input');
  userInput.type = 'text';
  userInput.className = 'form-input';
  userInput.placeholder = 'Filter by user...';
  userInput.style.maxWidth = '200px';

  const actionSelect = document.createElement('select');
  actionSelect.className = 'form-select';
  actionSelect.style.maxWidth = '200px';
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'All Actions';
  actionSelect.appendChild(defaultOpt);
  ['login', 'logout', 'issue_created', 'issue_resolved', 'issue_escalated', 'custody_assigned', 'custody_revoked', 'report_submitted', 'attendance_checkin'].forEach(a => {
    const opt = document.createElement('option');
    opt.value = a;
    opt.textContent = a.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    actionSelect.appendChild(opt);
  });

  const dateFrom = document.createElement('input');
  dateFrom.type = 'date';
  dateFrom.className = 'form-input';
  dateFrom.style.maxWidth = '180px';

  const dateTo = document.createElement('input');
  dateTo.type = 'date';
  dateTo.className = 'form-input';
  dateTo.style.maxWidth = '180px';
  dateTo.value = new Date().toISOString().split('T')[0];

  const filterBtn = document.createElement('button');
  filterBtn.className = 'btn btn-secondary';
  filterBtn.textContent = 'Apply';

  filterRow.appendChild(userInput);
  filterRow.appendChild(actionSelect);
  filterRow.appendChild(dateFrom);
  filterRow.appendChild(dateTo);
  filterRow.appendChild(filterBtn);
  container.appendChild(filterRow);

  // ── Table ──────────────────────────────────────────────────────────────
  const tableWrap = document.createElement('div');
  tableWrap.className = 'card';
  tableWrap.style.cssText = 'overflow-x: auto;';
  container.appendChild(tableWrap);

  const loadAudit = async () => {
    const filters = {};
    if (userInput.value) filters.user = userInput.value;
    if (actionSelect.value) filters.action = actionSelect.value;
    if (dateFrom.value) filters.date_from = dateFrom.value;
    if (dateTo.value) filters.date_to = dateTo.value;

    await withSkeleton(tableWrap, 3, (async () => {
      try {
        const entries = await getAuditLog(filters);
        tableWrap.innerHTML = '';

        if (entries.length === 0) {
          tableWrap.style.padding = '2rem';
          tableWrap.appendChild(createEmptyState('fa-shield-alt', 'No Activity', 'No audit log entries match your filters.'));
          return;
        }

        const table = document.createElement('table');
        table.className = 'custody-table';
        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        ['Timestamp', 'User', 'Action', 'Target', 'Details'].forEach(t => {
          const th = document.createElement('th');
          th.textContent = t;
          headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        entries.forEach(e => {
          const row = document.createElement('tr');

          const timeCell = document.createElement('td');
          timeCell.style.cssText = 'white-space: nowrap; font-size: 0.85rem;';
          timeCell.textContent = e.timestamp ? new Date(e.timestamp).toLocaleString() : '—';
          row.appendChild(timeCell);

          const userCell = document.createElement('td');
          userCell.style.fontWeight = '500';
          userCell.textContent = e.user || '—';
          row.appendChild(userCell);

          const actionCell = document.createElement('td');
          const actionColorMap = {
            login: 'primary', logout: 'warning', issue_created: 'danger',
            issue_resolved: 'success', issue_escalated: 'warning',
            custody_assigned: 'primary', custody_revoked: 'danger',
            report_submitted: 'success', attendance_checkin: 'success',
          };
          actionCell.appendChild(createBadge(
            (e.action || '').replace(/_/g, ' '),
            actionColorMap[e.action] || 'primary'
          ));
          row.appendChild(actionCell);

          const targetCell = document.createElement('td');
          targetCell.textContent = e.target || '—';
          row.appendChild(targetCell);

          const detailsCell = document.createElement('td');
          detailsCell.style.cssText = 'max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
          detailsCell.textContent = e.details || '—';
          detailsCell.title = e.details || '';
          row.appendChild(detailsCell);

          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableWrap.style.padding = '';
        tableWrap.appendChild(table);
      } catch {
        showToast('error', 'Failed to load audit log');
      }
    })());
  };

  filterBtn.addEventListener('click', loadAudit);
  await loadAudit();

  return () => {};
}
