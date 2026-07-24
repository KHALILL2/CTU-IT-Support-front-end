/**
 * js/views/staff/issues.js
 * Issue Management view for staff.
 * Both roles: report new issues.
 * IT Support: Kanban board with drag-and-drop, status updates, undo, escalation, filtering.
 * Lab Supervisor: Simple list of their reported issues.
 */
import { getIssues, getMyIssues, createIssue, updateIssueStatus, escalateIssue } from '../../api/issues.js';
import { showToast } from '../../components/toast.js';
import { openModal, closeModal } from '../../components/modal.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';
import { createBadge } from '../../components/badge.js';
import { startPolling, stopPolling } from '../../utils/polling.js';

export async function render(container, role) {
  container.innerHTML = '';
  const isIT = role === 'it_support';

  // ── Header + New Issue Button ──────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'flex-between mb-3';

  const headerLeft = document.createElement('div');
  const h3 = document.createElement('h3');
  h3.textContent = 'Issue Management';
  h3.style.marginBottom = '0.25rem';
  const desc = document.createElement('p');
  desc.className = 'text-muted';
  desc.textContent = isIT ? 'Track and resolve hardware issues' : 'Report hardware issues';
  headerLeft.appendChild(h3);
  headerLeft.appendChild(desc);
  header.appendChild(headerLeft);

  const newIssueBtn = document.createElement('button');
  newIssueBtn.className = 'btn btn-primary';
  newIssueBtn.id = 'btn-new-issue';
  const plusIcon = document.createElement('i');
  plusIcon.className = 'fas fa-plus';
  newIssueBtn.appendChild(plusIcon);
  newIssueBtn.appendChild(document.createTextNode(' Report Issue'));
  header.appendChild(newIssueBtn);
  container.appendChild(header);

  // New Issue modal handler
  newIssueBtn.addEventListener('click', () => {
    const form = document.createElement('form');

    const fields = [
      { id: 'issue-title', label: 'Title', type: 'text', placeholder: 'Brief issue title', required: true },
      { id: 'issue-room', label: 'Room Number', type: 'text', placeholder: 'e.g. Room 301', required: true },
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
      input.required = f.required;
      group.appendChild(label);
      group.appendChild(input);
      form.appendChild(group);
    });

    // Description textarea
    const descGroup = document.createElement('div');
    descGroup.className = 'form-group';
    descGroup.style.marginBottom = '1rem';
    const descLabel = document.createElement('label');
    descLabel.className = 'form-label';
    descLabel.textContent = 'Description';
    const descTA = document.createElement('textarea');
    descTA.className = 'form-textarea';
    descTA.id = 'issue-desc';
    descTA.rows = 3;
    descTA.placeholder = 'Describe the issue...';
    descTA.required = true;
    descGroup.appendChild(descLabel);
    descGroup.appendChild(descTA);
    form.appendChild(descGroup);

    // Priority select
    const prioGroup = document.createElement('div');
    prioGroup.className = 'form-group';
    prioGroup.style.marginBottom = '1rem';
    const prioLabel = document.createElement('label');
    prioLabel.className = 'form-label';
    prioLabel.textContent = 'Priority';
    const prioSelect = document.createElement('select');
    prioSelect.className = 'form-select';
    prioSelect.id = 'issue-priority';
    ['normal', 'urgent'].forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v.charAt(0).toUpperCase() + v.slice(1);
      prioSelect.appendChild(opt);
    });
    prioGroup.appendChild(prioLabel);
    prioGroup.appendChild(prioSelect);
    form.appendChild(prioGroup);

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
    submitBtn.textContent = 'Submit';
    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(submitBtn);
    form.appendChild(btnRow);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await createIssue({
          title: form.querySelector('#issue-title').value,
          description: form.querySelector('#issue-desc').value,
          room: form.querySelector('#issue-room').value,
          priority: form.querySelector('#issue-priority').value,
        });
        closeModal();
        showToast('success', 'Issue reported successfully');
        loadIssues();
      } catch {
        showToast('error', 'Failed to report issue');
      }
    });

    openModal(form, 'Report New Issue');
  });

  // ── Content Area ───────────────────────────────────────────────────────
  const contentArea = document.createElement('div');
  contentArea.id = 'issues-content';
  container.appendChild(contentArea);

  let filterMode = 'all'; // 'all' or 'mine'

  const loadIssues = async () => {
    await withSkeleton(contentArea, 3, (async () => {
      try {
        const issues = filterMode === 'mine' ? await getMyIssues() : await getIssues();
        contentArea.innerHTML = '';

        if (isIT) {
          // ── Filter Bar ─────────────────────────────────────────
          const filterBar = document.createElement('div');
          filterBar.className = 'issue-filter-bar';

          ['all', 'mine'].forEach(mode => {
            const chip = document.createElement('button');
            chip.className = `filter-chip ${filterMode === mode ? 'active' : ''}`;
            chip.textContent = mode === 'all' ? 'All Issues' : 'Assigned to Me';
            chip.addEventListener('click', () => {
              filterMode = mode;
              loadIssues();
            });
            filterBar.appendChild(chip);
          });
          contentArea.appendChild(filterBar);

          // ── Responsive Grid Board ───────────────────────────────
          const board = document.createElement('div');
          board.className = 'issues-grid';

          issues.forEach(issue => {
            const card = buildIssueCard(issue, true);
            board.appendChild(card);
          });

          if (issues.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'text-muted';
            empty.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 2rem; font-size: 0.85rem;';
            empty.textContent = 'No issues';
            board.appendChild(empty);
          }

          contentArea.appendChild(board);

        } else {
          // ── Lab Supervisor: Simple List ─────────────────────────
          if (issues.length === 0) {
            contentArea.appendChild(createEmptyState('fa-exclamation-triangle', 'No Issues', 'You haven\'t reported any issues.'));
            return;
          }

          const board = document.createElement('div');
          board.className = 'issues-grid';
          issues.forEach(issue => {
            board.appendChild(buildIssueCard(issue, false));
          });
          contentArea.appendChild(board);
        }
      } catch {
        showToast('error', 'Failed to load issues');
      }
    })());
  };

  function buildIssueCard(issue, isIT) {
    const card = document.createElement('div');
    card.className = `issue-card priority-${issue.priority || 'normal'}`;
    card.dataset.id = issue.id;
    if (isIT) {
      card.style.cursor = 'pointer';
    }

    const title = document.createElement('div');
    title.className = 'issue-card-title';
    title.textContent = issue.title;
    card.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'issue-card-meta';
    
    const room = document.createElement('span');
    room.className = 'issue-card-room';
    const roomIcon = document.createElement('i');
    roomIcon.className = 'fas fa-map-pin';
    room.appendChild(roomIcon);
    room.appendChild(document.createTextNode(` ${issue.room || '—'}`));
    meta.appendChild(room);
    
    meta.appendChild(createBadge(issue.priority || 'normal', issue.priority === 'urgent' ? 'danger' : 'primary'));
    
    let statusColor = 'warning';
    if (issue.status === 'in_progress') statusColor = 'primary';
    if (issue.status === 'resolved') statusColor = 'success';
    meta.appendChild(createBadge((issue.status || 'open').replace('_', ' '), statusColor));
    
    card.appendChild(meta);

    if (isIT) {
      // Make card clickable to open Management Modal
      card.addEventListener('click', () => openIssueModal(issue));
    }

    return card;
  }

  function openIssueModal(issue) {
    const wrapper = document.createElement('div');

    // Details section
    const details = document.createElement('div');
    details.style.marginBottom = '1.5rem';
    details.innerHTML = `
      <p style="margin-bottom: 0.5rem"><strong>Room:</strong> ${issue.room || '—'}</p>
      <p style="margin-bottom: 0.5rem"><strong>Priority:</strong> <span style="text-transform: capitalize">${issue.priority || 'Normal'}</span></p>
      <p style="margin-bottom: 0.5rem"><strong>Description:</strong></p>
      <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); font-size: 0.9rem;">
        ${issue.description || 'No description provided.'}
      </div>
    `;
    wrapper.appendChild(details);

    // Status form
    const form = document.createElement('form');
    
    const statusGroup = document.createElement('div');
    statusGroup.className = 'form-group';
    statusGroup.style.marginBottom = '1.5rem';
    
    const statusLabel = document.createElement('label');
    statusLabel.className = 'form-label';
    statusLabel.textContent = 'Update Status';
    
    const statusSelect = document.createElement('select');
    statusSelect.className = 'form-select';
    
    const statuses = [
      { val: 'open', label: 'Open' },
      { val: 'in_progress', label: 'In Progress' },
      { val: 'resolved', label: 'Resolved' }
    ];
    statuses.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.val;
      opt.textContent = s.label;
      if (issue.status === s.val) opt.selected = true;
      statusSelect.appendChild(opt);
    });
    
    statusGroup.appendChild(statusLabel);
    statusGroup.appendChild(statusSelect);
    form.appendChild(statusGroup);

    // Buttons
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
    
    const escalateBtn = document.createElement('button');
    escalateBtn.type = 'button';
    escalateBtn.className = 'btn btn-warning btn-sm';
    escalateBtn.innerHTML = '<i class="fas fa-level-up-alt"></i> Escalate';
    escalateBtn.addEventListener('click', async () => {
      try {
        await escalateIssue(issue.id);
        closeModal();
        showToast('success', 'Issue escalated to Admin');
        loadIssues();
      } catch {
        showToast('error', 'Failed to escalate issue');
      }
    });

    const rightBtns = document.createElement('div');
    rightBtns.style.cssText = 'display: flex; gap: 0.5rem;';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-ghost btn-sm';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', closeModal);
    
    const saveBtn = document.createElement('button');
    saveBtn.type = 'submit';
    saveBtn.className = 'btn btn-primary btn-sm';
    saveBtn.textContent = 'Save Changes';

    rightBtns.appendChild(cancelBtn);
    rightBtns.appendChild(saveBtn);
    
    btnRow.appendChild(escalateBtn);
    btnRow.appendChild(rightBtns);
    
    form.appendChild(btnRow);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const newStatus = statusSelect.value;
        if (newStatus !== issue.status) {
          await updateIssueStatus(issue.id, newStatus);
          showToast('success', 'Issue status updated');
          loadIssues();
        }
        closeModal();
      } catch {
        showToast('error', 'Failed to update issue status');
      }
    });

    wrapper.appendChild(form);
    openModal(wrapper, `Manage: ${issue.title}`);
  }

  await loadIssues();

  startPolling('staff-issues', loadIssues, window.CTU_CONFIG?.POLL_ISSUES_MS || 30000);

  return () => {
    stopPolling('staff-issues');
  };
}
