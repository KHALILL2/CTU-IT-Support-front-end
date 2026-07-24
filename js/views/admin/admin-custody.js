/**
 * js/views/admin/admin-custody.js
 * Admin Custody Management — assign/revoke equipment, view all.
 */
import { getAllCustody, assignCustody, revokeCustody } from '../../api/custody.js';
import { showToast } from '../../components/toast.js';
import { openModal, closeModal } from '../../components/modal.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';

export async function render(container) {
  container.innerHTML = '';

  // ── Header ─────────────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'flex-between mb-3';
  const headerLeft = document.createElement('div');
  const h3 = document.createElement('h3');
  h3.textContent = 'Custody Management';
  h3.style.marginBottom = '0.25rem';
  const desc = document.createElement('p');
  desc.className = 'text-muted';
  desc.textContent = 'Assign and manage equipment custody';
  headerLeft.appendChild(h3);
  headerLeft.appendChild(desc);
  header.appendChild(headerLeft);

  const assignBtn = document.createElement('button');
  assignBtn.className = 'btn btn-primary';
  const plusIcon = document.createElement('i');
  plusIcon.className = 'fas fa-plus';
  assignBtn.appendChild(plusIcon);
  assignBtn.appendChild(document.createTextNode(' Assign Equipment'));
  header.appendChild(assignBtn);
  container.appendChild(header);

  // ── Table ──────────────────────────────────────────────────────────────
  const tableWrap = document.createElement('div');
  tableWrap.className = 'card';
  tableWrap.style.cssText = 'overflow-x: auto;';
  container.appendChild(tableWrap);

  const loadCustody = async () => {
    await withSkeleton(tableWrap, 3, (async () => {
      try {
        const items = await getAllCustody();
        tableWrap.innerHTML = '';

        if (items.length === 0) {
          tableWrap.style.padding = '2rem';
          tableWrap.appendChild(createEmptyState('fa-boxes-stacked', 'No Assignments', 'No equipment has been assigned.'));
          return;
        }

        const table = document.createElement('table');
        table.className = 'custody-table';
        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        ['Item', 'Serial', 'Assigned To', 'Room', 'Status', 'Actions'].forEach(t => {
          const th = document.createElement('th');
          th.textContent = t;
          headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        items.forEach(item => {
          const row = document.createElement('tr');

          const nameCell = document.createElement('td');
          nameCell.style.fontWeight = '600';
          nameCell.textContent = item.item_name || item.name || '—';
          row.appendChild(nameCell);

          const serialCell = document.createElement('td');
          serialCell.style.cssText = 'font-family: monospace; font-size: 0.85rem;';
          serialCell.textContent = item.serial || '—';
          row.appendChild(serialCell);

          const userCell = document.createElement('td');
          userCell.textContent = item.user_name || item.assigned_to || '—';
          row.appendChild(userCell);

          const roomCell = document.createElement('td');
          roomCell.textContent = item.room || item.location || '—';
          row.appendChild(roomCell);

          const statusCell = document.createElement('td');
          const statusWrap = document.createElement('span');
          statusWrap.className = 'equip-status';
          const dot = document.createElement('span');
          const isGood = (item.status || 'good') === 'good';
          dot.className = `equip-dot ${isGood ? 'equip-dot--good' : 'equip-dot--maintenance'}`;
          statusWrap.appendChild(dot);
          statusWrap.appendChild(document.createTextNode(isGood ? 'Good' : 'Maintenance'));
          statusCell.appendChild(statusWrap);
          row.appendChild(statusCell);

          const actionsCell = document.createElement('td');
          const revokeBtn = document.createElement('button');
          revokeBtn.className = 'btn btn-danger';
          revokeBtn.style.cssText = 'font-size: 0.75rem; padding: 0.3rem 0.6rem;';
          revokeBtn.textContent = 'Revoke';
          revokeBtn.addEventListener('click', async () => {
            try {
              await revokeCustody(item.id);
              showToast('info', 'Custody revoked');
              loadCustody();
            } catch { showToast('error', 'Revoke failed'); }
          });
          actionsCell.appendChild(revokeBtn);
          row.appendChild(actionsCell);

          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableWrap.style.padding = '';
        tableWrap.appendChild(table);
      } catch {
        showToast('error', 'Failed to load custody data');
      }
    })());
  };

  // Assign equipment modal
  assignBtn.addEventListener('click', () => {
    const form = document.createElement('form');

    const fields = [
      { id: 'cust-user', label: 'Assign To (User ID)', type: 'number', placeholder: 'User ID' },
      { id: 'cust-item', label: 'Item Name', type: 'text', placeholder: 'e.g. Dell Monitor 24"' },
      { id: 'cust-serial', label: 'Serial Number', type: 'text', placeholder: 'e.g. SN-2024-001' },
      { id: 'cust-room', label: 'Room / Location', type: 'text', placeholder: 'e.g. Room 301' },
    ];

    fields.forEach(f => {
      const group = document.createElement('div');
      group.className = 'form-group';
      group.style.marginBottom = '1rem';
      const label = document.createElement('label');
      label.className = 'form-label';
      label.textContent = f.label;
      const input = document.createElement('input');
      input.type = f.type;
      input.className = 'form-input';
      input.id = f.id;
      input.placeholder = f.placeholder;
      input.required = true;
      group.appendChild(label);
      group.appendChild(input);
      form.appendChild(group);
    });

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;';
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-ghost';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', closeModal);
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Assign';
    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(submitBtn);
    form.appendChild(btnRow);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await assignCustody(form.querySelector('#cust-user').value, {
          item_name: form.querySelector('#cust-item').value,
          serial: form.querySelector('#cust-serial').value,
          room: form.querySelector('#cust-room').value,
        });
        closeModal();
        showToast('success', 'Equipment assigned');
        loadCustody();
      } catch { showToast('error', 'Assignment failed'); }
    });

    openModal(form, 'Assign Equipment');
  });

  await loadCustody();

  return () => {};
}
