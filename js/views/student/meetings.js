import { getMeetings } from '../../api/meetings.js';
import { createMeetingCard } from '../../components/meetingCard.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';
import { startPolling, stopPolling } from '../../utils/polling.js';

/**
 * Renders the Student Meetings view.
 * Sets up polling for live meetings and returns a cleanup function.
 * @param {HTMLElement} container 
 * @returns {Function} Cleanup function to stop polling.
 */
export async function render(container) {
  container.innerHTML = `
    <div class="mb-3">
      <h3 style="margin-bottom: 0.25rem;">Live & Scheduled Meetings</h3>
      <p class="text-muted">Join live technical support sessions or view upcoming ones.</p>
    </div>
    <div id="student-meetings-list" class="grid grid-2"></div>
  `;
  
  const listContainer = container.querySelector('#student-meetings-list');
  
  const loadMeetings = async (isInitial = false) => {
    const fetchAndRender = async () => {
      let meetings = [];
      try {
        meetings = await getMeetings();
      } catch (e) {
        listContainer.innerHTML = '';
        listContainer.appendChild(createEmptyState('fa-exclamation-circle', 'Error', 'Failed to load meetings.'));
        showToast('error', 'Failed to fetch active meetings.');
        return;
      }

      // Filter out completed ones for students
      const visible = meetings.filter(m => m.status !== 'completed');
      
      listContainer.innerHTML = '';
      if (visible.length === 0) {
        listContainer.appendChild(createEmptyState('fa-calendar', 'No Meetings', 'There are no active or scheduled meetings.'));
        listContainer.className = 'flex-center';
        return;
      }
      listContainer.className = 'grid grid-2';
      
      visible.forEach(m => {
        const card = createMeetingCard(m, 'student');
        listContainer.appendChild(card);
      });
    };

    if (isInitial) {
      await withSkeleton(listContainer, 2, fetchAndRender());
    } else {
      await fetchAndRender();
    }
  };
  
  // Initial load
  await loadMeetings(true);
  
  // Start polling
  const pollInterval = window.CTU_CONFIG?.POLL_MEETINGS_MS || 10000;
  startPolling('student-meetings', () => loadMeetings(false), pollInterval, false);
  
  // Return cleanup function for the router
  return () => {
    stopPolling('student-meetings');
  };
}
