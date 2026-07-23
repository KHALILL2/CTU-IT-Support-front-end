import { getToday, signAttendance, getByDate } from '../../api/attendance.js';
import { showToast } from '../../components/toast.js';

export async function render(container) {
  container.innerHTML = `
    <!-- Register Attendance Action -->
    <div class="attendance-action reveal">
      <h3 style="margin-bottom:1rem" data-i18n="att.register">Register Attendance</h3>
      <button class="btn btn-primary btn-lg glow-pulse ripple" id="register-btn">
        <i class="fas fa-fingerprint"></i>
        <span data-i18n="att.register" id="register-text">Register Attendance</span>
      </button>

      <div class="attendance-counter">
        <div class="counter-item">
          <h3 id="att-days">0</h3>
          <p data-i18n="att.days">Days Attended</p>
        </div>
        <div class="counter-item">
          <h3 id="att-streak">0</h3>
          <p data-i18n="att.streak">Current Streak</p>
        </div>
      </div>
    </div>

    <!-- Calendar -->
    <div class="card" style="padding: 1.5rem">
      <h4 class="mb-3" data-i18n="att.calendar">Attendance Calendar</h4>
      <div class="attendance-calendar" id="attendance-calendar">
        <!-- Populated by JS -->
      </div>

      <div style="display:flex; gap:1.5rem; margin-top:1.5rem; flex-wrap:wrap">
        <div style="display:flex; align-items:center; gap:0.5rem">
          <div style="width:16px;height:16px;border-radius:4px;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3)"></div>
          <span style="font-size:0.8rem;color:var(--text-tertiary)">Present</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem">
          <div style="width:16px;height:16px;border-radius:4px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2)"></div>
          <span style="font-size:0.8rem;color:var(--text-tertiary)">Absent</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem">
          <div style="width:16px;height:16px;border-radius:4px;border:2px solid var(--primary-500)"></div>
          <span style="font-size:0.8rem;color:var(--text-tertiary)">Today</span>
        </div>
      </div>
    </div>
  `;

  const btn = container.querySelector('#register-btn');
  const txt = container.querySelector('#register-text');
  
  // Setup button state based on today's attendance
  try {
    const today = await getToday();
    if (today.signed) {
      setSignedState(btn, txt);
    } else {
      btn.addEventListener('click', async () => {
        try {
          btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>Wait...</span>`;
          btn.classList.remove('glow-pulse');
          await signAttendance();
          showToast('success', window.t ? window.t('att.registered') : 'Attendance registered');
          setSignedState(btn, txt);
          
          // Increment Days
          const daysEl = container.querySelector('#att-days');
          daysEl.textContent = parseInt(daysEl.textContent) + 1;
        } catch (e) {
          if (e.status === 409) showToast('info', 'Already signed in.');
          else showToast('error', 'Failed to sign attendance.');
          btn.innerHTML = `<i class="fas fa-fingerprint"></i> <span id="register-text">Register Attendance</span>`;
        }
      });
    }
  } catch (e) {
    console.error('Failed to get today status', e);
  }

  // Generate mock calendar
  generateCalendar(container.querySelector('#attendance-calendar'));
  
  // Set mock stats
  container.querySelector('#att-days').textContent = '24';
  container.querySelector('#att-streak').textContent = '12';
}

function setSignedState(btn, txt) {
  btn.innerHTML = `<i class="fas fa-check-circle"></i> <span>${window.t ? window.t('att.registered') : 'Registered'}</span>`;
  btn.classList.remove('btn-primary', 'glow-pulse');
  btn.classList.add('btn-success');
  btn.style.pointerEvents = 'none';
}

function generateCalendar(grid) {
  const today = new Date().getDate();
  let html = '';
  // 30 day mockup
  for (let i = 1; i <= 30; i++) {
    let classes = 'calendar-day';
    if (i === today) classes += ' current-day';
    
    // Mock past data
    if (i < today) {
      // 80% chance present, 20% absent
      if (Math.random() > 0.2) classes += ' present';
      else classes += ' absent';
    }
    
    html += `<div class="${classes}">${i}</div>`;
  }
  grid.innerHTML = html;
}
