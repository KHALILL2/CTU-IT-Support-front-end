import { apiGet, apiPost, apiPatch, apiDelete } from './client.js';

// TODO: Mock data fallback when endpoints aren't live. Remove when backend is live.
let mockMeetings = [
  { id: 1, title: 'Weekly IT Sync', desc: 'Discussing network upgrades', status: 'active', time: '10:00 AM', link: 'https://meet.google.com/abc', location: '', type: 'online' },
  { id: 2, title: 'Lab Inspection', desc: 'Monthly lab equipment check', status: 'scheduled', time: '2:00 PM', link: '', location: 'Room 301 - Lab A', type: 'offline' }
];

function isReal() {
  return window.CTU_CONFIG && window.CTU_CONFIG.FEATURES && window.CTU_CONFIG.FEATURES.REAL_API;
}

export async function getMeetings() {
  if (!isReal()) return [...mockMeetings];
  return await apiGet('/meetings');
}

export async function getActiveMeetings() {
  if (!isReal()) return mockMeetings.filter(m => m.status === 'active');
  return await apiGet('/meetings/active');
}

export async function createMeeting(data) {
  if (!isReal()) {
    const newMeeting = { id: Date.now(), status: 'scheduled', ...data };
    mockMeetings.push(newMeeting);
    return newMeeting;
  }
  return await apiPost('/meetings', data);
}

export async function setMeetingStatus(id, status) {
  if (!isReal()) {
    const m = mockMeetings.find(m => m.id === id);
    if (m) m.status = status;
    return m;
  }
  return await apiPatch(`/meetings/${id}/status`, { status });
}

export async function removeMeeting(id) {
  if (!isReal()) {
    mockMeetings = mockMeetings.filter(m => m.id !== id);
    return true;
  }
  return await apiDelete(`/meetings/${id}`);
}
