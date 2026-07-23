export async function render(container) {
  container.innerHTML = `
    <div class="mb-4">
      <h3 style="margin-bottom: 0.5rem;">System Information</h3>
      <p class="text-muted">Documentation, configurations, and general information.</p>
    </div>
    
    <div class="grid grid-2" style="gap: 1.5rem;">
      <div class="card" style="padding: 1.5rem;">
        <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <i class="fas fa-server text-primary"></i> Server Status
        </h4>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem;">
          <li style="display: flex; justify-content: space-between;">
            <span class="text-muted">Environment</span>
            <span style="font-weight: 500;">Production</span>
          </li>
          <li style="display: flex; justify-content: space-between;">
            <span class="text-muted">Version</span>
            <span style="font-weight: 500;">v1.2.4</span>
          </li>
          <li style="display: flex; justify-content: space-between;">
            <span class="text-muted">Uptime</span>
            <span style="font-weight: 500; color: var(--success-500);">99.9%</span>
          </li>
          <li style="display: flex; justify-content: space-between;">
            <span class="text-muted">Last Deployment</span>
            <span style="font-weight: 500;">Today at 08:30 AM</span>
          </li>
        </ul>
      </div>

      <div class="card" style="padding: 1.5rem;">
        <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <i class="fas fa-book text-primary"></i> Quick Links
        </h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <a href="#" class="text-primary" style="text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-external-link-alt" style="font-size: 0.85rem;"></i> Admin Documentation
          </a>
          <a href="#" class="text-primary" style="text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-external-link-alt" style="font-size: 0.85rem;"></i> IT Support Handbook
          </a>
          <a href="#" class="text-primary" style="text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-external-link-alt" style="font-size: 0.85rem;"></i> Escalation Matrix
          </a>
        </div>
      </div>
      
      <div class="card" style="grid-column: 1 / -1; padding: 1.5rem;">
        <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <i class="fas fa-headset text-primary"></i> System Admins Contact
        </h4>
        <p class="text-muted" style="margin-bottom: 1rem;">For critical infrastructure issues, contact the tier-3 engineering team.</p>
        <div class="table-container">
          <table class="data-table" style="width: 100%;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid var(--border-color);">Name</th>
                <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid var(--border-color);">Role</th>
                <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid var(--border-color);">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border-color);">Dr. Ahmed Hassan</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border-color);">Lead Architect</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border-color);">ahmed@ctu.edu.eg</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border-color);">Eng. Sarah Mahmoud</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border-color);">SysOps</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border-color);">sarah@ctu.edu.eg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
