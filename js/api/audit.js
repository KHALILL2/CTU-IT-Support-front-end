/**
 * js/api/audit.js
 * Security audit log API module.
 */

import { apiGet, NotImplementedError } from './client.js';

/**
 * Get audit log entries, optionally filtered.
 * @param {object} [filters] - { user, action, date_from, date_to }
 * @returns {Promise<Array>}
 */
export async function getAuditLog(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const endpoint = params ? `/audit/?${params}` : '/audit/';
  try {
    return await apiGet(endpoint);
  } catch (err) {
    if (err instanceof NotImplementedError) {
      return window.CTU_DATA?.audit || [];
    }
    throw err;
  }
}
