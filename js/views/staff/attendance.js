/**
 * js/views/staff/attendance.js
 * Attendance & Meetings view for staff.
 * Both roles: geolocation check-in, meeting list.
 * IT Support only: availability toggle.
 */
import { geoCheckIn, getToday } from '../../api/attendance.js';
import { getMeetings } from '../../api/meetings.js';
import { setMine, getMyStatus } from '../../api/availability.js';
import { showToast } from '../../components/toast.js';
import { createToggle } from '../../components/toggle.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';
import { createMeetingCard } from '../../components/meetingCard.js';
import { startPolling, stopPolling } from '../../utils/polling.js';

export async function render(container, role) {
  container.innerHTML = '';

  // ── Geo Check-in Card ──────────────────────────────────────────────────
  const geoCard = document.createElement('div');
  geoCard.className = 'geo-checkin-card';

  const geoTitle = document.createElement('h3');
  geoTitle.textContent = 'Attendance Check-in';
  geoCard.appendChild(geoTitle);

  const geoDesc = document.createElement('p');
  geoDesc.className = 'text-muted';
  geoDesc.textContent = 'Verify your location to mark attendance';
  geoCard.appendChild(geoDesc);

  const geoBtn = document.createElement('button');
  geoBtn.className = 'btn btn-primary';
  geoBtn.id = 'geo-checkin-btn';

  const geoBtnIcon = document.createElement('i');
  geoBtnIcon.className = 'fas fa-map-marker-alt';
  geoBtn.appendChild(geoBtnIcon);
  geoBtn.appendChild(document.createTextNode(' Check In'));
  geoCard.appendChild(geoBtn);

  const geoStatus = document.createElement('div');
  geoStatus.className = 'geo-checkin-status not-checked-in';
  geoStatus.id = 'geo-status';
  geoCard.appendChild(geoStatus);

  container.appendChild(geoCard);

  // Check current status
  try {
    const today = await getToday();
    if (today.signed) {
      geoBtn.disabled = true;
      geoBtn.textContent = '✅ Checked In';
      geoStatus.className = 'geo-checkin-status checked-in';
      geoStatus.textContent = `Checked in at ${today.time}`;
    } else {
      geoStatus.textContent = 'Not checked in yet';
    }
  } catch { /* ignore */ }

  // Check-in handler
  geoBtn.addEventListener('click', async () => {
    if (!navigator.geolocation) {
      showToast('error', 'Geolocation is not supported by your browser');
      return;
    }

    geoBtn.disabled = true;
    geoBtn.textContent = 'Getting location...';

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await geoCheckIn(pos.coords.latitude, pos.coords.longitude);
          geoBtn.textContent = '✅ Checked In';
          geoStatus.className = 'geo-checkin-status checked-in';
          geoStatus.textContent = `Checked in at ${result.time}`;
          showToast('success', 'Attendance recorded successfully');
        } catch (err) {
          geoBtn.disabled = false;
          geoBtn.innerHTML = '';
          geoBtn.appendChild(geoBtnIcon);
          geoBtn.appendChild(document.createTextNode(' Check In'));
          if (err.status === 409) {
            showToast('info', 'Already checked in today');
          } else if (err.status === 403) {
            showToast('error', 'You are outside the allowed area');
          } else {
            showToast('error', 'Check-in failed. Please try again.');
          }
        }
      },
      (geoErr) => {
        geoBtn.disabled = false;
        geoBtn.innerHTML = '';
        geoBtn.appendChild(geoBtnIcon);
        geoBtn.appendChild(document.createTextNode(' Check In'));
        showToast('error', 'Location access denied. Please enable GPS.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  // ── IT Support Only: Availability Toggle ───────────────────────────────
  if (role === 'it_support') {
    const availCard = document.createElement('div');
    availCard.className = 'card it-only';
    availCard.style.cssText = 'padding: 1.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;';

    const availLabel = document.createElement('div');
    const availTitle = document.createElement('h4');
    availTitle.textContent = 'Availability Status';
    availTitle.style.marginBottom = '0.25rem';
    const availDesc = document.createElement('p');
    availDesc.className = 'text-muted';
    availDesc.style.fontSize = '0.85rem';
    availDesc.textContent = 'Toggle your availability for support requests';
    availLabel.appendChild(availTitle);
    availLabel.appendChild(availDesc);
    availCard.appendChild(availLabel);

    let currentStatus = false;
    try {
      const status = await getMyStatus();
      currentStatus = status?.available || false;
    } catch { /* ignore */ }

    const toggleEl = createToggle(currentStatus, async (checked) => {
      try {
        await setMine(checked);
        showToast('success', checked ? 'You are now Available' : 'You are now Busy');
      } catch {
        showToast('error', 'Failed to update availability');
      }
    });

    availCard.appendChild(toggleEl);
    container.appendChild(availCard);
  }

  // ── Meetings List ──────────────────────────────────────────────────────
  const meetSection = document.createElement('div');
  const meetHeader = document.createElement('h3');
  meetHeader.textContent = 'Meetings';
  meetHeader.style.marginBottom = '1rem';
  meetSection.appendChild(meetHeader);

  const meetList = document.createElement('div');
  meetList.className = 'grid grid-2';
  meetSection.appendChild(meetList);
  container.appendChild(meetSection);

  const loadMeetings = async () => {
    await withSkeleton(meetList, 2, (async () => {
      try {
        const meetings = await getMeetings();
        meetList.innerHTML = '';
        if (meetings.length === 0) {
          meetList.className = 'flex-center';
          meetList.appendChild(createEmptyState('fa-calendar', 'No Meetings', 'No meetings scheduled.'));
          return;
        }
        meetList.className = 'grid grid-2';
        meetings.forEach(m => {
          const card = createMeetingCard(m, role === 'it_support' ? 'student' : 'student', {});
          meetList.appendChild(card);
        });
      } catch {
        showToast('error', 'Failed to load meetings');
      }
    })());
  };

  await loadMeetings();

  // Poll for meeting updates
  startPolling('staff-meetings', loadMeetings, window.CTU_CONFIG?.POLL_MEETINGS_MS || 60000);

  return () => {
    stopPolling('staff-meetings');
  };
}
