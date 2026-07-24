/**
 * js/views/staff/custody.js
 * Equipment Custody view for staff.
 * Both roles: view assigned hardware.
 * Lab Supervisor: toggle equipment status (Good / Needs Maintenance).
 */
import { getMyCustody, reportEquipmentStatus } from '../../api/custody.js';
import { showToast } from '../../components/toast.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';
import { createToggle } from '../../components/toggle.js';
import { getRole } from '../../utils/jwt.js';

export async function render(container, role) {
  container.innerHTML = '';
  const isLab = (role || getRole()) === 'lab_supervisor';

  // ── Header ─────────────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'flex-between mb-3';
  const headerLeft = document.createElement('div');
  const h3 = document.createElement('h3');
  h3.textContent = 'Equipment Custody';
  h3.style.marginBottom = '0.25rem';
  const desc = document.createElement('p');
  desc.className = 'text-muted';
  desc.textContent = 'Your assigned equipment and locations';
  headerLeft.appendChild(h3);
  headerLeft.appendChild(desc);
  header.appendChild(headerLeft);
  container.appendChild(header);

  // ── Table Container ────────────────────────────────────────────────────
  const tableWrap = document.createElement('div');
  tableWrap.className = 'card';
  tableWrap.style.cssText = 'overflow-x: auto;';
  tableWrap.id = 'custody-table-wrap';
  container.appendChild(tableWrap);

  const loadCustody = async () => {
    await withSkeleton(tableWrap, 2, (async () => {
      try {
        const items = await getMyCustody();
        tableWrap.innerHTML = '';

        if (items.length === 0) {
          tableWrap.style.padding = '2rem';
          tableWrap.appendChild(createEmptyState('fa-boxes-stacked', 'No Equipment', 'You have no equipment assigned to you.'));
          return;
        }

        const table = document.createElement('table');
        table.className = 'custody-table';

        // Header
        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        const cols = ['Item', 'Serial Number', 'Location', 'Status'];
        if (isLab) cols.push('Report');
        cols.forEach(c => {
          const th = document.createElement('th');
          th.textContent = c;
          headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        items.forEach(item => {
          const row = document.createElement('tr');

          // Name
          const nameCell = document.createElement('td');
          nameCell.style.fontWeight = '600';
          nameCell.textContent = item.item_name || item.name || '—';
          row.appendChild(nameCell);

          // Serial
          const serialCell = document.createElement('td');
          serialCell.style.cssText = 'font-family: monospace; font-size: 0.85rem;';
          serialCell.textContent = item.serial || '—';
          row.appendChild(serialCell);

          // Location
          const locCell = document.createElement('td');
          const locIcon = document.createElement('i');
          locIcon.className = 'fas fa-map-pin';
          locIcon.style.cssText = 'margin-right: 0.5rem; color: var(--text-tertiary);';
          locCell.appendChild(locIcon);
          locCell.appendChild(document.createTextNode(item.room || item.location || '—'));
          row.appendChild(locCell);

          // Status
          const statusCell = document.createElement('td');
          const statusWrap = document.createElement('span');
          statusWrap.className = 'equip-status';
          const dot = document.createElement('span');
          const isGood = (item.status || 'good') === 'good';
          dot.className = `equip-dot ${isGood ? 'equip-dot--good' : 'equip-dot--maintenance'}`;
          statusWrap.appendChild(dot);
          statusWrap.appendChild(document.createTextNode(isGood ? 'Good' : 'Needs Maintenance'));
          statusCell.appendChild(statusWrap);
          row.appendChild(statusCell);

          // Lab Supervisor: toggle
          if (isLab) {
            const toggleCell = document.createElement('td');
            toggleCell.className = 'lab-only';
            const { el: toggleEl } = createToggle(isGood, async (checked) => {
              const newStatus = checked ? 'good' : 'needs_maintenance';
              // Optimistic UI
              dot.className = `equip-dot ${checked ? 'equip-dot--good' : 'equip-dot--maintenance'}`;
              statusWrap.lastChild.textContent = checked ? 'Good' : 'Needs Maintenance';
              try {
                await reportEquipmentStatus(item.id, newStatus);
                showToast('success', `Status updated to ${checked ? 'Good' : 'Needs Maintenance'}`);
              } catch {
                // Revert
                dot.className = `equip-dot ${!checked ? 'equip-dot--good' : 'equip-dot--maintenance'}`;
                statusWrap.lastChild.textContent = !checked ? 'Good' : 'Needs Maintenance';
                showToast('error', 'Failed to update equipment status');
              }
            });
            toggleCell.appendChild(toggleEl);
            row.appendChild(toggleCell);
          }

          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableWrap.appendChild(table);
      } catch {
        showToast('error', 'Failed to load custody data');
      }
    })());
  };

  await loadCustody();

  return () => {};
}
