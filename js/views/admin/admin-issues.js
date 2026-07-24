/**
 * js/views/admin/admin-issues.js
 * Admin Issues Override — full privileges to view, edit, escalate.
 */
import { getIssues, updateIssueStatus, escalateIssue } from '../../api/issues.js';
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
  h3.textContent = 'All Issues';
  h3.style.marginBottom = '0.25rem';
  const desc = document.createElement('p');
  desc.className = 'text-muted';
  desc.textContent = 'Full issue management with override privileges';
  headerLeft.appendChild(h3);
  headerLeft.appendChild(desc);
  header.appendChild(headerLeft);
  container.appendChild(header);

  // ── Filter Bar ─────────────────────────────────────────────────────────
  const filterBar = document.createElement('div');
  filterBar.className = 'issue-filter-bar';
  let activeFilter = 'all';

  ['all', 'open', 'in_progress', 'resolved'].forEach(f => {
    const chip = document.createElement('button');
    chip.className = `filter-chip ${activeFilter === f ? 'active' : ''}`;
    chip.textContent = f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    chip.addEventListener('click', () => {
      activeFilter = f;
      filterBar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      loadIssues();
    });
    filterBar.appendChild(chip);
  });
  container.appendChild(filterBar);

  // ── Table ──────────────────────────────────────────────────────────────
  const tableWrap = document.createElement('div');
  tableWrap.className = 'card';
  tableWrap.style.cssText = 'overflow-x: auto;';
  container.appendChild(tableWrap);

  const loadIssues = async () => {
    const filters = activeFilter !== 'all' ? { status: activeFilter } : {};
    await withSkeleton(tableWrap, 3, (async () => {
      try {
        const issues = await getIssues(filters);
        tableWrap.innerHTML = '';

        if (issues.length === 0) {
          tableWrap.style.padding = '2rem';
          tableWrap.appendChild(createEmptyState('fa-exclamation-triangle', 'No Issues', 'No issues match the current filter.'));
          return;
        }

        const table = document.createElement('table');
        table.className = 'custody-table';
        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        ['Title', 'Room', 'Priority', 'Status', 'Actions'].forEach(t => {
          const th = document.createElement('th');
          th.textContent = t;
          headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        issues.forEach(issue => {
          const row = document.createElement('tr');

          const titleCell = document.createElement('td');
          titleCell.style.fontWeight = '600';
          titleCell.textContent = issue.title || '—';
          row.appendChild(titleCell);

          const roomCell = document.createElement('td');
          roomCell.textContent = issue.room || '—';
          row.appendChild(roomCell);

          const prioCell = document.createElement('td');
          prioCell.appendChild(createBadge(issue.priority || 'normal', issue.priority === 'urgent' ? 'danger' : 'primary'));
          row.appendChild(prioCell);

          const statusCell = document.createElement('td');
          const statusMap = { open: 'warning', in_progress: 'primary', resolved: 'success' };
          statusCell.appendChild(createBadge(issue.status || 'open', statusMap[issue.status] || 'warning'));
          row.appendChild(statusCell);

          const actionsCell = document.createElement('td');
          const actionsWrap = document.createElement('div');
          actionsWrap.style.cssText = 'display: flex; gap: 0.5rem;';

          // Status change buttons
          if ((issue.status || 'open') !== 'resolved') {
            const resolveBtn = document.createElement('button');
            resolveBtn.className = 'btn btn-success';
            resolveBtn.style.cssText = 'font-size: 0.75rem; padding: 0.3rem 0.6rem;';
            resolveBtn.textContent = 'Resolve';
            resolveBtn.addEventListener('click', async () => {
              try {
                await updateIssueStatus(issue.id, 'resolved');
                showToast('success', 'Issue resolved');
                loadIssues();
              } catch { showToast('error', 'Failed to resolve'); }
            });
            actionsWrap.appendChild(resolveBtn);
          }

          if (!issue.escalated) {
            const escBtn = document.createElement('button');
            escBtn.className = 'btn btn-warning';
            escBtn.style.cssText = 'font-size: 0.75rem; padding: 0.3rem 0.6rem;';
            escBtn.textContent = 'Escalate';
            escBtn.addEventListener('click', async () => {
              try {
                await escalateIssue(issue.id);
                showToast('success', 'Issue escalated');
                loadIssues();
              } catch { showToast('error', 'Escalation failed'); }
            });
            actionsWrap.appendChild(escBtn);
          }

          actionsCell.appendChild(actionsWrap);
          row.appendChild(actionsCell);
          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableWrap.style.padding = '';
        tableWrap.appendChild(table);
      } catch {
        showToast('error', 'Failed to load issues');
      }
    })());
  };

  await loadIssues();

  return () => {};
}
