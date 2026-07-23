import { getMeetings, createMeeting, setMeetingStatus, removeMeeting } from '../../api/meetings.js';
import { createMeetingCard } from '../../components/meetingCard.js';
import { openModal, closeModal } from '../../components/modal.js';
import { showToast } from '../../components/toast.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';

/**
 * Renders the Admin Meetings view into the provided container.
 * @param {HTMLElement} container 
 */
export async function render(container) {
  container.innerHTML = `
    <div class="flex-between mb-3">
      <div>
        <h3 style="margin-bottom: 0.25rem;">Meeting Management</h3>
        <p class="text-muted">Schedule and manage live support sessions.</p>
      </div>
      <button class="btn btn-primary" id="btn-new-meeting">
        <i class="fas fa-plus"></i> New Meeting
      </button>
    </div>
    <div id="meetings-list" class="grid grid-2"></div>
  `;
  
  const listContainer = container.querySelector('#meetings-list');
  
  const loadMeetings = async () => {
    await withSkeleton(listContainer, 2, (async () => {
      const meetings = await getMeetings();
      // Filter out completed ones for cleaner UI, or just show them all
      const visible = meetings.filter(m => m.status !== 'completed');

      listContainer.innerHTML = '';
      if (visible.length === 0) {
        listContainer.appendChild(createEmptyState('fa-calendar', 'No Meetings', 'There are no active or scheduled meetings.'));
        listContainer.className = 'flex-center';
        return;
      }
      listContainer.className = 'grid grid-2';
      
      visible.forEach(m => {
        const card = createMeetingCard(m, 'admin', {
          onStart: async (id) => {
            try {
              await setMeetingStatus(id, 'active');
              showToast('success', 'Meeting started');
              loadMeetings();
            } catch (e) {
              showToast('error', 'Failed to start meeting.');
            }
          },
          onEnd: async (id) => {
            try {
              await setMeetingStatus(id, 'completed');
              showToast('success', 'Meeting ended');
              loadMeetings();
            } catch (e) {
              showToast('error', 'Failed to end meeting.');
            }
          },
          onDelete: async (id) => {
            try {
              await removeMeeting(id);
              showToast('info', 'Meeting deleted');
              loadMeetings();
            } catch (e) {
              showToast('error', 'Failed to delete meeting.');
            }
          }
        });
        listContainer.appendChild(card);
      });
    })());
  };
  
  container.querySelector('#btn-new-meeting').addEventListener('click', () => {
    const form = document.createElement('form');
    form.innerHTML = `
      <div class="form-group mb-2">
        <label class="form-label">Title</label>
        <input type="text" class="form-input" id="meet-title" required>
      </div>
      <div class="form-group mb-2">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" id="meet-desc" rows="3" required></textarea>
      </div>
      <div class="form-group mb-2">
        <label class="form-label">Meeting Link</label>
        <input type="url" class="form-input" id="meet-link" placeholder="https://meet.google.com/..." required>
      </div>
      <div class="form-group mb-2">
        <label class="form-label">Time</label>
        <input type="time" class="form-input" id="meet-time" required>
      </div>
      <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
        <button type="button" class="btn btn-ghost" id="meet-cancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Create</button>
      </div>
    `;
    
    form.querySelector('#meet-cancel').onclick = closeModal;
    form.onsubmit = async (e) => {
      e.preventDefault();
      try {
        await createMeeting({
          title: form.querySelector('#meet-title').value,
          desc: form.querySelector('#meet-desc').value,
          link: form.querySelector('#meet-link').value,
          time: form.querySelector('#meet-time').value,
        });
        closeModal();
        showToast('success', 'Meeting scheduled');
        loadMeetings();
      } catch (err) {
        showToast('error', 'Failed to create meeting.');
      }
    };
    
    openModal(form, 'Schedule New Meeting');
  });
  
  await loadMeetings();
}
