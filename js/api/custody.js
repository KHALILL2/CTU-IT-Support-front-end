/**
 * js/api/custody.js
 * Equipment custody management API module.
 */

import { apiGet, apiPost, apiPatch, apiDelete, NotImplementedError } from './client.js';

/**
 * Get the current user's assigned custody items.
 * @returns {Promise<Array>}
 */
export async function getMyCustody() {
  try {
    return await apiGet('/custody/mine/');
  } catch (err) {
    if (err instanceof NotImplementedError) {
      return window.CTU_DATA?.custody || [];
    }
    throw err;
  }
}

/**
 * Get all custody assignments (admin).
 * @returns {Promise<Array>}
 */
export async function getAllCustody() {
  try {
    return await apiGet('/custody/');
  } catch (err) {
    if (err instanceof NotImplementedError) {
      return window.CTU_DATA?.custody || [];
    }
    throw err;
  }
}

/**
 * Assign equipment custody to a user.
 * @param {number|string} userId
 * @param {{ item_name: string, serial: string, room: string }} data
 * @returns {Promise<object>}
 */
export async function assignCustody(userId, data) {
  try {
    return await apiPost('/custody/', { user_id: userId, ...data });
  } catch (err) {
    if (err instanceof NotImplementedError) {
      return { id: Date.now(), user_id: userId, ...data, status: 'good' };
    }
    throw err;
  }
}

/**
 * Revoke equipment custody.
 * @param {number|string} id
 * @returns {Promise<null>}
 */
export async function revokeCustody(id) {
  try {
    return await apiDelete(`/custody/${id}/`);
  } catch (err) {
    if (err instanceof NotImplementedError) {
      return null;
    }
    throw err;
  }
}

/**
 * Report equipment status during handover.
 * @param {number|string} id
 * @param {'good'|'needs_maintenance'} status
 * @returns {Promise<object>}
 */
export async function reportEquipmentStatus(id, status) {
  try {
    return await apiPatch(`/custody/${id}/status/`, { status });
  } catch (err) {
    if (err instanceof NotImplementedError) {
      return { id, status };
    }
    throw err;
  }
}
