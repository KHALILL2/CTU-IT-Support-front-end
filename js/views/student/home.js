import { getToday, signAttendance } from '../../api/attendance.js';
import { getMyStatus, setMine } from '../../api/availability.js';
import { showToast } from '../../components/toast.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createToggle } from '../../components/toggle.js';

export async function render(container) {
  container.innerHTML = `
    <div class="mb-3">
      <h3 style="margin-bottom: 0.25rem;">Daily Overview</h3>
      <p class="text-muted">Manage your availability and lab attendance.</p>
    </div>
    <div class="grid grid-2 mb-4">
      <div id="availability-card"></div>
      <div id="attendance-card"></div>
    </div>
  `;
  
  const availContainer = container.querySelector('#availability-card');
  const attenContainer = container.querySelector('#attendance-card');
  
  // Load Availability
  const loadAvailability = async () => {
    await withSkeleton(availContainer, 1, (async () => {
      const status = await getMyStatus();
      
      const card = document.createElement('div');
      card.className = 'feature-card flex-between';
      card.style.padding = '2rem';
      card.style.height = '100%';
      
      const info = document.createElement('div');
      info.innerHTML = `
        <h4 style="margin: 0;">Availability</h4>
        <p class="text-muted" style="margin-top: 0.5rem;">Let staff know you are ready to help.</p>
      `;
      card.appendChild(info);
      
      const toggle = createToggle(status.available, async (checked) => {
        try {
          await setMine(checked);
          showToast('success', checked ? 'You are now available.' : 'You are now away.');
        } catch (e) {
          showToast('error', 'Failed to update availability.');
          // Optimistic UI revert
          const input = toggle.querySelector('input');
          if (input) input.checked = !checked;
        }
      });
      
      card.appendChild(toggle);
      
      availContainer.innerHTML = '';
      availContainer.appendChild(card);
    })());
  };

  // Load Attendance
  const loadAttendance = async () => {
    await withSkeleton(attenContainer, 1, (async () => {
      const today = await getToday();
      
      const card = document.createElement('div');
      card.className = 'feature-card flex-between';
      card.style.padding = '2rem';
      card.style.height = '100%';
      
      const info = document.createElement('div');
      if (today.signed) {
        info.innerHTML = `
          <h4 style="margin: 0; color: var(--success-600);">
            <i class="fas fa-check-circle"></i> Signed In
          </h4>
          <p class="text-muted" style="margin-top: 0.5rem;">Recorded at ${today.time}</p>
        `;
        card.appendChild(info);
      } else {
        info.innerHTML = `
          <h4 style="margin: 0;">Not Signed In</h4>
          <p class="text-muted" style="margin-top: 0.5rem;">Please record your attendance.</p>
        `;
        card.appendChild(info);
        
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.textContent = 'Sign Attendance';
        btn.onclick = async () => {
          try {
            await signAttendance();
            showToast('success', 'Attendance recorded successfully.');
            loadAttendance();
          } catch (e) {
            if (e.status === 403) showToast('error', 'Location not allowed.');
            else if (e.status === 409) showToast('info', 'Already signed in.');
            else showToast('error', 'Failed to sign attendance.');
          }
        };
        card.appendChild(btn);
      }
      
      attenContainer.innerHTML = '';
      attenContainer.appendChild(card);
    })());
  };
  
  await Promise.all([loadAvailability(), loadAttendance()]);
}
