/**
 * js/api/reports.js
 * Daily reports API module (Lab Supervisor shift reports).
 */

import { apiGet, apiPost, NotImplementedError } from './client.js';

/**
 * Get reports, optionally filtered.
 * @param {object} [filters] - { supervisor, room, date }
 * @returns {Promise<Array>}
 */
export async function getReports(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const endpoint = params ? `/reports/?${params}` : '/reports/';
  try {
    return await apiGet(endpoint);
  } catch (err) {
    if (err instanceof NotImplementedError) {
      return window.CTU_DATA?.reports || [];
    }
    throw err;
  }
}

/**
 * Get a single report by ID.
 * @param {number|string} id
 * @returns {Promise<object>}
 */
export async function getReportById(id) {
  try {
    return await apiGet(`/reports/${id}/`);
  } catch (err) {
    if (err instanceof NotImplementedError) {
      return { id, shift: 'morning', notes: 'Mock report', submitted_at: new Date().toISOString() };
    }
    throw err;
  }
}

/**
 * Submit a new daily report.
 * @param {{ shift: 'morning'|'evening', instructors: string, supervisor: string, custody_notes: string, notes: string, room: string }} data
 * @returns {Promise<object>}
 */
export async function submitReport(data) {
  try {
    return await apiPost('/reports/', data);
  } catch (err) {
    if (err instanceof NotImplementedError) {
      const newItem = { id: Date.now(), ...data, submitted_at: new Date().toISOString() };
      window.CTU_DATA = window.CTU_DATA || {};
      window.CTU_DATA.reports = window.CTU_DATA.reports || [];
      window.CTU_DATA.reports.unshift(newItem);
      if (window.saveMockData) window.saveMockData();
      return newItem;
    }
    throw err;
  }
}
