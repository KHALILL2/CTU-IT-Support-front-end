/**
 * js/views/staff/reports.js
 * Daily Reports view — Lab Supervisor only.
 * Morning/Evening shift report form + report history.
 */
import { submitReport, getReports } from '../../api/reports.js';
import { showToast } from '../../components/toast.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';

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
  desc.textContent = 'Submit your shift report for today';
  headerLeft.appendChild(h3);
  headerLeft.appendChild(desc);
  header.appendChild(headerLeft);
  container.appendChild(header);

  // ── Report Form ────────────────────────────────────────────────────────
  const form = document.createElement('form');
  form.id = 'report-form';

  // Shift Selection
  const shiftSection = document.createElement('div');
  shiftSection.className = 'report-form-section';
  const shiftTitle = document.createElement('h4');
  shiftTitle.textContent = 'Shift Information';
  shiftSection.appendChild(shiftTitle);

  const shiftGrid = document.createElement('div');
  shiftGrid.className = 'report-form-grid';

  // Shift select
  const shiftGroup = document.createElement('div');
  shiftGroup.className = 'form-group';
  const shiftLabel = document.createElement('label');
  shiftLabel.className = 'form-label';
  shiftLabel.textContent = 'Shift';
  const shiftSelect = document.createElement('select');
  shiftSelect.className = 'form-select';
  shiftSelect.id = 'report-shift';
  shiftSelect.required = true;
  ['morning', 'evening'].forEach(v => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v.charAt(0).toUpperCase() + v.slice(1);
    shiftSelect.appendChild(opt);
  });
  shiftGroup.appendChild(shiftLabel);
  shiftGroup.appendChild(shiftSelect);
  shiftGrid.appendChild(shiftGroup);

  // Room
  const roomGroup = document.createElement('div');
  roomGroup.className = 'form-group';
  const roomLabel = document.createElement('label');
  roomLabel.className = 'form-label';
  roomLabel.textContent = 'Room Number';
  const roomInput = document.createElement('input');
  roomInput.type = 'text';
  roomInput.className = 'form-input';
  roomInput.id = 'report-room';
  roomInput.placeholder = 'e.g. Room 301';
  roomInput.required = true;
  roomGroup.appendChild(roomLabel);
  roomGroup.appendChild(roomInput);
  shiftGrid.appendChild(roomGroup);

  shiftSection.appendChild(shiftGrid);
  form.appendChild(shiftSection);

  // Personnel Section
  const personnelSection = document.createElement('div');
  personnelSection.className = 'report-form-section';
  const persTitle = document.createElement('h4');
  persTitle.textContent = 'Personnel';
  personnelSection.appendChild(persTitle);

  const persGrid = document.createElement('div');
  persGrid.className = 'report-form-grid';

  // Instructors
  const instrGroup = document.createElement('div');
  instrGroup.className = 'form-group';
  const instrLabel = document.createElement('label');
  instrLabel.className = 'form-label';
  instrLabel.textContent = 'Instructors Present';
  const instrInput = document.createElement('textarea');
  instrInput.className = 'form-textarea';
  instrInput.id = 'report-instructors';
  instrInput.rows = 3;
  instrInput.placeholder = 'Names of instructors present...';
  instrInput.required = true;
  instrGroup.appendChild(instrLabel);
  instrGroup.appendChild(instrInput);
  persGrid.appendChild(instrGroup);

  // Supervisor
  const supGroup = document.createElement('div');
  supGroup.className = 'form-group';
  const supLabel = document.createElement('label');
  supLabel.className = 'form-label';
  supLabel.textContent = 'Supervisor Name';
  const supInput = document.createElement('input');
  supInput.type = 'text';
  supInput.className = 'form-input';
  supInput.id = 'report-supervisor';
  supInput.placeholder = 'Your supervisor name';
  supInput.required = true;
  supGroup.appendChild(supLabel);
  supGroup.appendChild(supInput);
  persGrid.appendChild(supGroup);

  personnelSection.appendChild(persGrid);
  form.appendChild(personnelSection);

  // Notes Section
  const notesSection = document.createElement('div');
  notesSection.className = 'report-form-section';
  const notesTitle = document.createElement('h4');
  notesTitle.textContent = 'Additional Details';
  notesSection.appendChild(notesTitle);

  const notesGrid = document.createElement('div');
  notesGrid.className = 'report-form-grid';

  // Custody Handover
  const custGroup = document.createElement('div');
  custGroup.className = 'form-group';
  const custLabel = document.createElement('label');
  custLabel.className = 'form-label';
  custLabel.textContent = 'Custody Handover Notes';
  const custInput = document.createElement('textarea');
  custInput.className = 'form-textarea';
  custInput.id = 'report-custody';
  custInput.rows = 3;
  custInput.placeholder = 'Equipment handover details...';
  custGroup.appendChild(custLabel);
  custGroup.appendChild(custInput);
  notesGrid.appendChild(custGroup);

  // General Notes
  const genGroup = document.createElement('div');
  genGroup.className = 'form-group';
  const genLabel = document.createElement('label');
  genLabel.className = 'form-label';
  genLabel.textContent = 'General Notes';
  const genInput = document.createElement('textarea');
  genInput.className = 'form-textarea';
  genInput.id = 'report-notes';
  genInput.rows = 3;
  genInput.placeholder = 'Any additional observations...';
  genGroup.appendChild(genLabel);
  genGroup.appendChild(genInput);
  notesGrid.appendChild(genGroup);

  notesSection.appendChild(notesGrid);
  form.appendChild(notesSection);

  // Submit Button
  const submitRow = document.createElement('div');
  submitRow.style.cssText = 'display: flex; justify-content: flex-end; margin-top: 1rem;';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-primary';
  const submitIcon = document.createElement('i');
  submitIcon.className = 'fas fa-paper-plane';
  submitBtn.appendChild(submitIcon);
  submitBtn.appendChild(document.createTextNode(' Submit Report'));
  submitRow.appendChild(submitBtn);
  form.appendChild(submitRow);

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    try {
      await submitReport({
        shift: shiftSelect.value,
        room: roomInput.value,
        instructors: instrInput.value,
        supervisor: supInput.value,
        custody_notes: custInput.value,
        notes: genInput.value,
      });
      showToast('success', 'Report submitted successfully');
      form.reset();
      loadHistory();
    } catch {
      showToast('error', 'Failed to submit report');
    } finally {
      submitBtn.disabled = false;
    }
  });

  container.appendChild(form);

  // ── Report History ─────────────────────────────────────────────────────
  const historySection = document.createElement('div');
  historySection.style.marginTop = '2rem';
  const histTitle = document.createElement('h3');
  histTitle.textContent = 'Previous Reports';
  histTitle.style.marginBottom = '1rem';
  historySection.appendChild(histTitle);

  const histList = document.createElement('div');
  histList.id = 'report-history';
  historySection.appendChild(histList);
  container.appendChild(historySection);

  const loadHistory = async () => {
    await withSkeleton(histList, 2, (async () => {
      try {
        const reports = await getReports();
        histList.innerHTML = '';
        if (reports.length === 0) {
          histList.appendChild(createEmptyState('fa-file-alt', 'No Reports', 'You haven\'t submitted any reports yet.'));
          return;
        }
        reports.forEach(r => {
          const card = document.createElement('div');
          card.className = 'report-history-card';

          const cardHeader = document.createElement('div');
          cardHeader.className = 'report-history-header';
          const shiftBadge = document.createElement('strong');
          shiftBadge.textContent = `${(r.shift || 'morning').charAt(0).toUpperCase() + (r.shift || 'morning').slice(1)} Shift`;
          const dateSpan = document.createElement('span');
          dateSpan.textContent = r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : '—';
          cardHeader.appendChild(shiftBadge);
          cardHeader.appendChild(dateSpan);
          card.appendChild(cardHeader);

          if (r.notes) {
            const notesP = document.createElement('p');
            notesP.className = 'text-muted';
            notesP.style.fontSize = '0.85rem';
            notesP.textContent = r.notes;
            card.appendChild(notesP);
          }

          histList.appendChild(card);
        });
      } catch {
        showToast('error', 'Failed to load report history');
      }
    })());
  };

  await loadHistory();

  return () => {};
}
