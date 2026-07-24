/**
 * js/api/issues.js
 * Issue management API module.
 */

import { apiGet, apiPost, apiPatch, NotImplementedError } from './client.js';

/**
 * Get all issues, optionally filtered.
 * @param {object} [filters] - { status, priority, assigned_to }
 * @returns {Promise<Array>}
 */
export async function getIssues(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const endpoint = params ? `/issues/?${params}` : '/issues/';
  try {
    return await apiGet(endpoint);
  } catch (err) {
    if (err instanceof NotImplementedError) {
      return window.CTU_DATA?.issues || [];
    }
    throw err;
  }
}

/**
 * Get issues assigned to the current user.
 * @returns {Promise<Array>}
 */
export async function getMyIssues() {
  return getIssues({ assigned_to: 'me' });
}

/**
 * Report a new issue.
 * @param {{ title: string, description: string, room: string, priority: 'urgent'|'normal' }} data
 * @returns {Promise<object>}
 */
export async function createIssue(data) {
  try {
    return await apiPost('/issues/', data);
  } catch (err) {
    if (err instanceof NotImplementedError) {
      const newItem = { id: Date.now(), ...data, status: 'open', created_at: new Date().toISOString() };
      window.CTU_DATA = window.CTU_DATA || {};
      window.CTU_DATA.issues = window.CTU_DATA.issues || [];
      window.CTU_DATA.issues.unshift(newItem);
      if (window.saveMockData) window.saveMockData();
      return newItem;
    }
    throw err;
  }
}

/**
 * Update issue status.
 * @param {number|string} id
 * @param {'open'|'in_progress'|'resolved'} status
 * @returns {Promise<object>}
 */
export async function updateIssueStatus(id, status) {
  try {
    return await apiPatch(`/issues/${id}/`, { status });
  } catch (err) {
    if (err instanceof NotImplementedError) {
      if (window.CTU_DATA?.issues) {
        const issue = window.CTU_DATA.issues.find(i => String(i.id) === String(id));
        if (issue) {
          issue.status = status;
          if (window.saveMockData) window.saveMockData();
        }
      }
      return { id, status };
    }
    throw err;
  }
}

/**
 * Escalate an issue to admin.
 * @param {number|string} id
 * @returns {Promise<object>}
 */
export async function escalateIssue(id) {
  try {
    return await apiPost(`/issues/${id}/escalate/`, {});
  } catch (err) {
    if (err instanceof NotImplementedError) {
      return { id, escalated: true };
    }
    throw err;
  }
}
