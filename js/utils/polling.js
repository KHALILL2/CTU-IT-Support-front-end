/**
 * js/utils/polling.js
 * Managed polling utility — starts/stops interval-based data refresh.
 *
 * Usage:
 *   import { startPolling, stopPolling, stopAllPolling } from '../utils/polling.js';
 *
 *   const id = startPolling('reports', fetchReports, CTU_CONFIG.POLL_REPORTS_MS);
 *   stopPolling('reports');
 */

/** @type {Map<string, number>} Tracks active interval IDs by name. */
const _polls = new Map();

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Start a named polling interval.
 * If a poll with the same name is already running, it is stopped first.
 *
 * @param {string}   name       - Unique name for this poll (e.g. 'reports').
 * @param {Function} callback   - Async or sync function to call on each tick.
 * @param {number}   intervalMs - Interval in milliseconds.
 * @param {boolean} [runImmediately=true] - Whether to invoke callback right away.
 * @returns {string} The poll name (useful for chaining).
 */
export function startPolling(name, callback, intervalMs, runImmediately = true) {
  // Clean up existing poll with this name
  stopPolling(name);

  if (runImmediately) {
    try { callback(); } catch (e) { console.warn(`[polling] ${name} initial run failed:`, e); }
  }

  const id = setInterval(async () => {
    try {
      await callback();
    } catch (e) {
      console.warn(`[polling] ${name} tick failed:`, e);
    }
  }, intervalMs);

  _polls.set(name, id);
  return name;
}

/**
 * Stop a named polling interval.
 * @param {string} name
 */
export function stopPolling(name) {
  if (_polls.has(name)) {
    clearInterval(_polls.get(name));
    _polls.delete(name);
  }
}

/**
 * Stop all active polls. Call on page unload / view teardown.
 */
export function stopAllPolling() {
  _polls.forEach((id) => clearInterval(id));
  _polls.clear();
}

/**
 * Return names of all currently active polls.
 * @returns {string[]}
 */
export function activePolls() {
  return [..._polls.keys()];
}
