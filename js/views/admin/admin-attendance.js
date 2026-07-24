/**
 * js/views/admin/admin-attendance.js
 * Admin Attendance & Meeting Management.
 * Manual attendance override + meeting scheduling.
 */
import { getByDate } from '../../api/attendance.js';
import { getMeetings, createMeeting, setMeetingStatus } from '../../api/meetings.js';
import { showToast } from '../../components/toast.js';
import { openModal, closeModal } from '../../components/modal.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';
import { createBadge } from '../../components/badge.js';

export async function render(container) {
  container.innerHTML = '';

  // ── Attendance Section ─────────────────────────────────────────────────
  const attSection = document.createElement('div');
  attSection.style.marginBottom = '2rem';

  const attHeader = document.createElement('div');
  attHeader.className = 'flex-between mb-3';
  const attTitle = document.createElement('h3');
  attTitle.textContent = 'Attendance Records';
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.className = 'form-input';
  dateInput.style.maxWidth = '200px';
  dateInput.value = new Date().toISOString().split('T')[0];
  attHeader.appendChild(attTitle);
  attHeader.appendChild(dateInput);
  attSection.appendChild(attHeader);

  const attTableWrap = document.createElement('div');
  attTableWrap.className = 'card';
  attTableWrap.style.cssText = 'overflow-x: auto;';
  attSection.appendChild(attTableWrap);
  container.appendChild(attSection);

  const loadAttendance = async () => {
    await withSkeleton(attTableWrap, 2, (async () => {
      try {
        const records = await getByDate(dateInput.value);
        attTableWrap.innerHTML = '';

        if (records.length === 0) {
          attTableWrap.style.padding = '2rem';
          attTableWrap.appendChild(createEmptyState('fa-calendar-check', 'No Records', 'No attendance records for this date.'));
          return;
        }

        const table = document.createElement('table');
        table.className = 'custody-table';
        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        ['Name', 'Time', 'Status'].forEach(t => {
          const th = document.createElement('th');
          th.textContent = t;
          headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        records.forEach(r => {
          const row = document.createElement('tr');
          const nameCell = document.createElement('td');
          nameCell.style.fontWeight = '600';
          nameCell.textContent = r.name || '—';
          row.appendChild(nameCell);

          const timeCell = document.createElement('td');
          timeCell.textContent = r.time || '—';
          row.appendChild(timeCell);

          const statusCell = document.createElement('td');
          statusCell.appendChild(createBadge(r.status || 'present', r.status === 'late' ? 'warning' : 'success'));
          row.appendChild(statusCell);

          tbody.appendChild(row);
        });
        table.appendChild(tbody);
        attTableWrap.style.padding = '';
        attTableWrap.appendChild(table);
      } catch {
        showToast('error', 'Failed to load attendance');
      }
    })());
  };

  dateInput.addEventListener('change', loadAttendance);
  await loadAttendance();

  // ── Meetings Section ───────────────────────────────────────────────────
  const meetSection = document.createElement('div');
  const meetHeader = document.createElement('div');
  meetHeader.className = 'flex-between mb-3';
  const meetTitle = document.createElement('h3');
  meetTitle.textContent = 'Meetings';
  const newMeetBtn = document.createElement('button');
  newMeetBtn.className = 'btn btn-primary';
  const plusIcon = document.createElement('i');
  plusIcon.className = 'fas fa-plus';
  newMeetBtn.appendChild(plusIcon);
  newMeetBtn.appendChild(document.createTextNode(' Schedule Meeting'));
  meetHeader.appendChild(meetTitle);
  meetHeader.appendChild(newMeetBtn);
  meetSection.appendChild(meetHeader);

  const meetList = document.createElement('div');
  meetList.className = 'grid grid-2';
  meetSection.appendChild(meetList);
  container.appendChild(meetSection);

  const loadMeetings = async () => {
    await withSkeleton(meetList, 2, (async () => {
      try {
        const meetings = await getMeetings();
        meetList.innerHTML = '';
        if (meetings.length === 0) {
          meetList.className = 'flex-center';
          meetList.appendChild(createEmptyState('fa-calendar', 'No Meetings', 'No meetings scheduled.'));
          return;
        }
        meetList.className = 'grid grid-2';
        meetings.forEach(m => {
          const card = document.createElement('div');
          card.className = 'card';
          card.style.padding = '1.25rem';

          const titleRow = document.createElement('div');
          titleRow.className = 'flex-between';
          titleRow.style.marginBottom = '0.5rem';
          const titleH4 = document.createElement('h4');
          titleH4.style.fontSize = '1rem';
          titleH4.textContent = m.title;
          titleRow.appendChild(titleH4);
          titleRow.appendChild(createBadge(m.status, m.status === 'active' ? 'success' : 'warning'));
          card.appendChild(titleRow);

          const descP = document.createElement('p');
          descP.className = 'text-muted';
          descP.style.cssText = 'font-size: 0.85rem; margin-bottom: 0.75rem;';
          descP.textContent = m.desc || '';
          card.appendChild(descP);

          // Type indicator
          const typeInfo = document.createElement('p');
          typeInfo.style.cssText = 'font-size: 0.8rem; color: var(--text-tertiary);';
          if (m.type === 'offline') {
            typeInfo.textContent = `📍 ${m.location || 'On-site'}`;
          } else {
            typeInfo.textContent = `🔗 Online Meeting`;
          }
          card.appendChild(typeInfo);

          // Toggle status button
          const toggleBtn = document.createElement('button');
          toggleBtn.className = m.status === 'active' ? 'btn btn-danger' : 'btn btn-success';
          toggleBtn.style.cssText = 'margin-top: 0.75rem; font-size: 0.8rem; padding: 0.4rem 1rem;';
          toggleBtn.textContent = m.status === 'active' ? 'End Meeting' : 'Start Meeting';
          toggleBtn.addEventListener('click', async () => {
            try {
              const newStatus = m.status === 'active' ? 'completed' : 'active';
              await setMeetingStatus(m.id, newStatus);
              showToast('success', newStatus === 'active' ? 'Meeting started' : 'Meeting ended');
              loadMeetings();
            } catch {
              showToast('error', 'Failed to update meeting');
            }
          });
          card.appendChild(toggleBtn);

          meetList.appendChild(card);
        });
      } catch {
        showToast('error', 'Failed to load meetings');
      }
    })());
  };

  // Schedule meeting modal
  newMeetBtn.addEventListener('click', () => {
    const form = document.createElement('form');

    const fields = [
      { id: 'meet-title', label: 'Title', type: 'text', placeholder: 'Meeting title' },
      { id: 'meet-time', label: 'Time', type: 'time', placeholder: '' },
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

    // Description
    const descGroup = document.createElement('div');
    descGroup.className = 'form-group';
    descGroup.style.marginBottom = '1rem';
    const descLabel = document.createElement('label');
    descLabel.className = 'form-label';
    descLabel.textContent = 'Description';
    const descTA = document.createElement('textarea');
    descTA.className = 'form-textarea';
    descTA.id = 'meet-desc';
    descTA.rows = 2;
    descGroup.appendChild(descLabel);
    descGroup.appendChild(descTA);
    form.appendChild(descGroup);

    // Type select
    const typeGroup = document.createElement('div');
    typeGroup.className = 'form-group';
    typeGroup.style.marginBottom = '1rem';
    const typeLabel = document.createElement('label');
    typeLabel.className = 'form-label';
    typeLabel.textContent = 'Type';
    const typeSelect = document.createElement('select');
    typeSelect.className = 'form-select';
    typeSelect.id = 'meet-type';
    ['online', 'offline'].forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v.charAt(0).toUpperCase() + v.slice(1);
      typeSelect.appendChild(opt);
    });
    typeGroup.appendChild(typeLabel);
    typeGroup.appendChild(typeSelect);
    form.appendChild(typeGroup);

    // Link / Location (conditional)
    const linkGroup = document.createElement('div');
    linkGroup.className = 'form-group';
    linkGroup.style.marginBottom = '1rem';
    linkGroup.id = 'meet-link-group';
    const linkLabel = document.createElement('label');
    linkLabel.className = 'form-label';
    linkLabel.textContent = 'Meeting Link';
    linkLabel.id = 'meet-link-label';
    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.className = 'form-input';
    linkInput.id = 'meet-link';
    linkInput.placeholder = 'https://meet.google.com/...';
    linkGroup.appendChild(linkLabel);
    linkGroup.appendChild(linkInput);
    form.appendChild(linkGroup);

    typeSelect.addEventListener('change', () => {
      if (typeSelect.value === 'offline') {
        linkLabel.textContent = 'Location';
        linkInput.placeholder = 'e.g. Room 301 - Lab A';
        linkInput.type = 'text';
      } else {
        linkLabel.textContent = 'Meeting Link';
        linkInput.placeholder = 'https://meet.google.com/...';
        linkInput.type = 'url';
      }
    });

    // Buttons
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
    submitBtn.textContent = 'Schedule';
    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(submitBtn);
    form.appendChild(btnRow);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const type = typeSelect.value;
      try {
        await createMeeting({
          title: form.querySelector('#meet-title').value,
          desc: form.querySelector('#meet-desc').value,
          time: form.querySelector('#meet-time').value,
          type,
          link: type === 'online' ? linkInput.value : '',
          location: type === 'offline' ? linkInput.value : '',
        });
        closeModal();
        showToast('success', 'Meeting scheduled');
        loadMeetings();
      } catch {
        showToast('error', 'Failed to schedule meeting');
      }
    });

    openModal(form, 'Schedule New Meeting');
  });

  await loadMeetings();

  return () => {};
}
