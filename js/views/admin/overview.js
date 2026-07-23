import { getAllStudents } from '../../api/availability.js';
import { getMeetings } from '../../api/meetings.js';
import { withSkeleton } from '../../components/skeleton.js';

export async function render(container) {
  container.innerHTML = `
    <div class="mb-4">
      <h3 style="margin-bottom: 0.5rem;">System Overview</h3>
      <p class="text-muted">High-level view of system metrics and active sessions.</p>
    </div>
    
    <div id="overview-content"></div>
  `;

  const content = container.querySelector('#overview-content');

  const fetchAndRender = async () => {
    let students = [];
    let meetings = [];
    try {
      students = await getAllStudents();
      meetings = await getMeetings();
    } catch (e) {
      console.error("Failed to load overview data:", e);
    }

    const availableStudents = students.filter(s => s.available).length;
    const totalStudents = students.length;
    
    const activeMeetings = meetings.filter(m => m.status === 'active').length;
    const scheduledMeetings = meetings.filter(m => m.status === 'scheduled').length;

    content.innerHTML = `
      <div class="grid grid-3 mb-4">
        <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="text-muted" style="font-weight: 500;">Available Engineers</span>
            <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(16, 185, 129, 0.1); color: var(--success-500); display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-users"></i>
            </div>
          </div>
          <h2 style="font-size: 2.5rem; margin: 0; color: var(--text-primary);">${availableStudents} / ${totalStudents}</h2>
          <span style="font-size: 0.85rem; color: var(--success-500);"><i class="fas fa-arrow-up"></i> Online currently</span>
        </div>

        <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="text-muted" style="font-weight: 500;">Active Meetings</span>
            <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(59, 130, 246, 0.1); color: var(--primary-500); display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-video"></i>
            </div>
          </div>
          <h2 style="font-size: 2.5rem; margin: 0; color: var(--text-primary);">${activeMeetings}</h2>
          <span style="font-size: 0.85rem; color: var(--text-muted);">In progress</span>
        </div>

        <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="text-muted" style="font-weight: 500;">Scheduled Meetings</span>
            <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(245, 158, 11, 0.1); color: var(--warning-500); display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-calendar-alt"></i>
            </div>
          </div>
          <h2 style="font-size: 2.5rem; margin: 0; color: var(--text-primary);">${scheduledMeetings}</h2>
          <span style="font-size: 0.85rem; color: var(--text-muted);">Upcoming sessions</span>
        </div>
      </div>
      
      <div class="card" style="padding: 1.5rem;">
        <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Quick Actions</h4>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="#meetings" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-plus"></i> New Meeting
          </a>
          <a href="#students" class="btn btn-outline" style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-users"></i> Manage Users
          </a>
        </div>
      </div>
    `;
  };

  await withSkeleton(content, 3, fetchAndRender());
}
