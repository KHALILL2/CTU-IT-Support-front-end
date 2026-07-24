/**
 * js/views/admin/overview.js
 * Admin dashboard overview — shows high-level system metrics.
 */
import { apiGet, NotImplementedError } from '../../api/client.js';
import { getMeetings } from '../../api/meetings.js';
import { getIssues } from '../../api/issues.js';
import { withSkeleton } from '../../components/skeleton.js';
import { showToast } from '../../components/toast.js';

async function fetchUsers() {
  try { return await apiGet('/users/'); }
  catch (e) {
    if (e instanceof NotImplementedError) {
      return [
        { role: 'lab_supervisor', available: true },
        { role: 'it_support', available: false },
        { role: 'it_support', available: true },
      ];
    }
    throw e;
  }
}

export async function render(container) {
  container.innerHTML = '';
  const content = document.createElement('div');
  container.appendChild(content);

  const fetchAndRender = async () => {
    let users = [];
    let meetings = [];
    let issues = [];

    try {
      users = await fetchUsers();
      meetings = await getMeetings();
      issues = await getIssues();
    } catch (e) {
      // Allow partial failure
    }

    const availableIT = users.filter(u => u.role === 'it_support' && u.available).length;
    const totalIT = users.filter(u => u.role === 'it_support').length;
    const openIssues = issues.filter(i => (i.status || 'open') === 'open' || i.status === 'in_progress').length;
    const activeMeetings = meetings.filter(m => m.status === 'active').length;

    content.innerHTML = `
      <div class="grid grid-3 mb-4">
        <div class="stat-card">
          <div class="stat-card-icon success">
            <i class="fas fa-headset"></i>
          </div>
          <div class="stat-card-info">
            <h3>${availableIT} / ${totalIT}</h3>
            <p>IT Support Online</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-icon warning">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="stat-card-info">
            <h3>${openIssues}</h3>
            <p>Open Issues</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-icon primary">
            <i class="fas fa-video"></i>
          </div>
          <div class="stat-card-info">
            <h3>${activeMeetings}</h3>
            <p>Active Meetings</p>
          </div>
        </div>
      </div>
      
      <div class="card" style="padding: 1.5rem;">
        <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-default); padding-bottom: 0.5rem;">Quick Actions</h4>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="#users" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-user-plus"></i> Manage Users
          </a>
          <a href="#issues" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-wrench"></i> Review Issues
          </a>
          <a href="#reports" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-file-alt"></i> Daily Reports
          </a>
        </div>
      </div>
    `;
  };

  await withSkeleton(content, 3, fetchAndRender());

  return () => {}; // Cleanup function
}
