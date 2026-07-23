import { getByDate } from '../../api/attendance.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';

export async function render(container) {
  container.innerHTML = `
    <div class="flex-between mb-3">
      <div>
        <h3 style="margin-bottom: 0.25rem;">Attendance Reports</h3>
        <p class="text-muted">View student attendance records by date.</p>
      </div>
      <div>
        <input type="date" id="report-date" class="form-input" style="width: auto;">
      </div>
    </div>
    <div id="reports-table-container"></div>
  `;
  
  const tableContainer = container.querySelector('#reports-table-container');
  const dateInput = container.querySelector('#report-date');
  
  // Set today as default
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  
  const loadReports = async (date) => {
    await withSkeleton(tableContainer, 3, (async () => {
      let records = [];
      try {
        records = await getByDate(date);
      } catch (e) {
        tableContainer.innerHTML = '';
        tableContainer.appendChild(createEmptyState('fa-exclamation-circle', 'Error', 'Failed to load attendance records.'));
        showToast('error', 'Failed to fetch attendance reports.');
        return;
      }
      
      tableContainer.innerHTML = '';
      
      if (records.length === 0) {
        tableContainer.appendChild(createEmptyState('fa-clipboard-list', 'No Records', 'No attendance recorded for this date.'));
        return;
      }
      
      const wrapper = document.createElement('div');
      wrapper.className = 'table-container';
      
      let html = `
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      records.forEach(r => {
        const badgeStatus = r.status === 'present' ? 'done' : (r.status === 'late' ? 'warning' : 'danger');
        const badgeHtml = `<span class="badge badge-${badgeStatus}">${r.status}</span>`;
        html += `
            <tr>
              <td>#${r.id}</td>
              <td>${r.name}</td>
              <td>${r.time}</td>
              <td>${badgeHtml}</td>
            </tr>
        `;
      });
      
      html += `</tbody></table>`;
      wrapper.innerHTML = html;
      
      tableContainer.appendChild(wrapper);
    })());
  };
  
  dateInput.addEventListener('change', (e) => {
    loadReports(e.target.value);
  });
  
  await loadReports(today);
}
