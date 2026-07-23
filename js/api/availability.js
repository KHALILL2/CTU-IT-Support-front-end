import { apiGet, apiPost } from './client.js';

// TODO: Mock data fallback when endpoints aren't live. Remove when backend is live.
let mockMyStatus = false;
let mockStudents = [
  { id: 1, name: 'Ahmed Ali', email: 'ahmed@ctu.edu', available: true },
  { id: 2, name: 'Sara Kamel', email: 'sara@ctu.edu', available: false },
  { id: 3, name: 'Current Student', email: 'student@ctu.edu', available: false }
];

function isReal() {
  return window.CTU_CONFIG?.FEATURES?.REAL_API;
}

export async function getMyStatus() {
  if (!isReal()) return { available: mockMyStatus };
  return await apiGet('/availability/me');
}

export async function setMine(available) {
  if (!isReal()) {
    mockMyStatus = available;
    const me = mockStudents.find(s => s.name === 'Current Student');
    if (me) me.available = available;
    return { success: true };
  }
  return await apiPost('/availability/me', { available });
}

export async function getAllStudents() {
  if (!isReal()) return [...mockStudents];
  return await apiGet('/availability/students');
}
