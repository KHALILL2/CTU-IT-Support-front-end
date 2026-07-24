import { apiGet, apiPost } from './client.js';

// TODO: Mock data fallback when endpoints aren't live. Remove when backend is live.
let mockTodaySigned = false;
let mockRecords = [
  { id: 1, name: 'Ahmed Ali', time: '08:30 AM', date: new Date().toISOString().split('T')[0], status: 'present' },
  { id: 2, name: 'Sara Kamel', time: '08:45 AM', date: new Date().toISOString().split('T')[0], status: 'late' }
];

function isReal() {
  return window.CTU_CONFIG?.FEATURES?.REAL_API;
}

export async function getToday() {
  if (!isReal()) {
    return { signed: mockTodaySigned, time: mockTodaySigned ? new Date().toLocaleTimeString() : null };
  }
  return await apiGet('/attendance/today');
}

export async function signAttendance() {
  if (!isReal()) {
    if (mockTodaySigned) {
      const err = new Error('Already signed');
      err.status = 409;
      throw err;
    }
    // Simulate location/time fail randomly if needed, but we'll stick to success for mock
    mockTodaySigned = true;
    const todayStr = new Date().toISOString().split('T')[0];
    mockRecords.push({
      id: Date.now(),
      name: 'Current Student',
      time: new Date().toLocaleTimeString(),
      date: todayStr,
      status: 'present'
    });
    return { success: true, time: new Date().toLocaleTimeString() };
  }
  return await apiPost('/attendance/sign');
}

export async function getByDate(date) {
  if (!isReal()) {
    return mockRecords.filter(r => !date || r.date === date);
  }
  return await apiGet(`/attendance/reports?date=${date}`);
}

/**
 * Geolocation-based attendance check-in.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<object>}
 */
export async function geoCheckIn(lat, lng) {
  if (!isReal()) {
    if (mockTodaySigned) {
      const err = new Error('Already checked in');
      err.status = 409;
      throw err;
    }
    mockTodaySigned = true;
    return { success: true, time: new Date().toLocaleTimeString(), location: { lat, lng } };
  }
  return await apiPost('/attendance/checkin/', { latitude: lat, longitude: lng });
}

