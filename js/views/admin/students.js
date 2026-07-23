import { getAllStudents } from '../../api/availability.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';
import { startPolling, stopPolling } from '../../utils/polling.js';

export async function render(container) {
  container.innerHTML = `
    <div class="mb-3">
      <h3 style="margin-bottom: 0.25rem;">Students Directory</h3>
      <p class="text-muted">View student availability and details.</p>
    </div>
    <div id="students-table-container"></div>
  `;
  
  const tableContainer = container.querySelector('#students-table-container');
  
  const loadStudents = async (isInitial = false) => {
    const fetchAndRender = async () => {
      let students = [];
      try {
        students = await getAllStudents();
      } catch (e) {
        tableContainer.innerHTML = '';
        tableContainer.appendChild(createEmptyState('fa-exclamation-circle', 'Error', 'Failed to load students.'));
        showToast('error', 'Failed to fetch students.');
        return;
      }
      
      tableContainer.innerHTML = '';
      if (students.length === 0) {
        tableContainer.appendChild(createEmptyState('fa-users', 'No Students', 'No students found.'));
        return;
      }
      
      const wrapper = document.createElement('div');
      wrapper.className = 'table-container';
      
      let html = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      students.forEach(s => {
        const dotClass = s.available ? 'dot--on' : 'dot--off';
        const label = s.available ? 'Available' : 'Away';
        html += `
            <tr>
              <td style="width: 120px;">
                <div class="flex" style="align-items: center; gap: 0.5rem;">
                  <span class="dot ${dotClass}"></span>
                  <span class="text-muted" style="font-size: 0.85rem;">${label}</span>
                </div>
              </td>
              <td><strong>${s.name}</strong></td>
              <td>${s.email}</td>
            </tr>
        `;
      });
      
      html += `</tbody></table>`;
      wrapper.innerHTML = html;
      tableContainer.appendChild(wrapper);
    };

    if (isInitial) {
      await withSkeleton(tableContainer, 3, fetchAndRender());
    } else {
      await fetchAndRender();
    }
  };
  
  await loadStudents(true);
  
  const pollInterval = window.CTU_CONFIG?.POLL_ATTENDANCE_MS || 15000;
  startPolling('admin-students', () => loadStudents(false), pollInterval, false);
  
  return () => {
    stopPolling('admin-students');
  };
}
