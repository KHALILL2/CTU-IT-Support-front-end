/**
 * js/views/admin/admin-reports.js
 * Admin Daily Reports Review — view, filter, export.
 */
import { getReports } from '../../api/reports.js';
import { showToast } from '../../components/toast.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';
import { createBadge } from '../../components/badge.js';
import { apiGet, NotImplementedError } from '../../api/client.js';

export async function render(container) {
  container.innerHTML = '';

  // ── Header ─────────────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'flex-between mb-3';

  const headerLeft = document.createElement('div');
  const h3 = document.createElement('h3');
  h3.textContent = 'Daily Reports';
  h3.style.marginBottom = '0.25rem';
  const desc = document.createElement('p');
  desc.className = 'text-muted';
  desc.textContent = 'Review lab supervisor shift reports';
  headerLeft.appendChild(h3);
  headerLeft.appendChild(desc);
  header.appendChild(headerLeft);

  // Export buttons
  const exportRow = document.createElement('div');
  exportRow.style.cssText = 'display: flex; gap: 0.5rem;';

  const exportExcel = document.createElement('button');
  exportExcel.className = 'btn btn-success';
  exportExcel.style.cssText = 'font-size: 0.85rem;';
  const excelIcon = document.createElement('i');
  excelIcon.className = 'fas fa-file-excel';
  exportExcel.appendChild(excelIcon);
  exportExcel.appendChild(document.createTextNode(' Export Excel'));
  exportExcel.addEventListener('click', async () => {
    try {
      const url = `${window.CTU_CONFIG?.API_BASE_URL || ''}/reports/export/?format=xlsx`;
      window.open(url, '_blank');
    } catch { showToast('error', 'Export failed'); }
  });

  const exportPdf = document.createElement('button');
  exportPdf.className = 'btn btn-danger';
  exportPdf.style.cssText = 'font-size: 0.85rem;';
  const pdfIcon = document.createElement('i');
  pdfIcon.className = 'fas fa-file-pdf';
  exportPdf.appendChild(pdfIcon);
  exportPdf.appendChild(document.createTextNode(' Export PDF'));
  exportPdf.addEventListener('click', async () => {
    try {
      const url = `${window.CTU_CONFIG?.API_BASE_URL || ''}/reports/export/?format=pdf`;
      window.open(url, '_blank');
    } catch { showToast('error', 'Export failed'); }
  });

  exportRow.appendChild(exportExcel);
  exportRow.appendChild(exportPdf);
  header.appendChild(exportRow);
  container.appendChild(header);

  // ── Filter Row ─────────────────────────────────────────────────────────
  const filterRow = document.createElement('div');
  filterRow.style.cssText = 'display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;';

  const supervisorInput = document.createElement('input');
  supervisorInput.type = 'text';
  supervisorInput.className = 'form-input';
  supervisorInput.placeholder = 'Filter by supervisor name...';
  supervisorInput.style.maxWidth = '250px';

  const roomInput = document.createElement('input');
  roomInput.type = 'text';
  roomInput.className = 'form-input';
  roomInput.placeholder = 'Filter by room...';
  roomInput.style.maxWidth = '200px';

  const filterBtn = document.createElement('button');
  filterBtn.className = 'btn btn-secondary';
  filterBtn.textContent = 'Filter';

  filterRow.appendChild(supervisorInput);
  filterRow.appendChild(roomInput);
  filterRow.appendChild(filterBtn);
  container.appendChild(filterRow);

  // ── Table ──────────────────────────────────────────────────────────────
  const tableWrap = document.createElement('div');
  tableWrap.className = 'card';
  tableWrap.style.cssText = 'overflow-x: auto;';
  container.appendChild(tableWrap);

  const loadReports = async () => {
    const filters = {};
    if (supervisorInput.value) filters.supervisor = supervisorInput.value;
    if (roomInput.value) filters.room = roomInput.value;

    await withSkeleton(tableWrap, 3, (async () => {
      try {
        let reports = await getReports(filters);

        // Client-side fallback filtering for mock data
        if (supervisorInput.value) {
          const q = supervisorInput.value.toLowerCase();
          reports = reports.filter(r => (r.supervisor || '').toLowerCase().includes(q));
        }
        if (roomInput.value) {
          const q = roomInput.value.toLowerCase();
          reports = reports.filter(r => (r.room || '').toLowerCase().includes(q));
        }

        tableWrap.innerHTML = '';

        if (reports.length === 0) {
          tableWrap.style.padding = '2rem';
          tableWrap.appendChild(createEmptyState('fa-file-alt', 'No Reports', 'No reports match your filter criteria.'));
          return;
        }

        const table = document.createElement('table');
        table.className = 'custody-table';
        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        ['Date', 'Shift', 'Room', 'Supervisor', 'Notes'].forEach(t => {
          const th = document.createElement('th');
          th.textContent = t;
          headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        reports.forEach(r => {
          const row = document.createElement('tr');

          const dateCell = document.createElement('td');
          dateCell.textContent = r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : '—';
          row.appendChild(dateCell);

          const shiftCell = document.createElement('td');
          shiftCell.appendChild(createBadge(r.shift || 'morning', r.shift === 'evening' ? 'primary' : 'success'));
          row.appendChild(shiftCell);

          const roomCell = document.createElement('td');
          roomCell.textContent = r.room || '—';
          row.appendChild(roomCell);

          const supCell = document.createElement('td');
          supCell.style.fontWeight = '500';
          supCell.textContent = r.supervisor || '—';
          row.appendChild(supCell);

          const notesCell = document.createElement('td');
          notesCell.style.cssText = 'max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
          notesCell.textContent = r.notes || '—';
          notesCell.title = r.notes || '';
          row.appendChild(notesCell);

          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableWrap.style.padding = '';
        tableWrap.appendChild(table);
      } catch {
        showToast('error', 'Failed to load reports');
      }
    })());
  };

  filterBtn.addEventListener('click', loadReports);
  supervisorInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadReports(); });
  roomInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadReports(); });

  await loadReports();

  return () => {};
}
