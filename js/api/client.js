/**
 * js/api/client.js
 * Authenticated HTTP client for the CTU Support backend.
 *
 * Exports: apiGet, apiPost, apiPatch, apiDelete
 *
 * Features:
 *  - Reads API_BASE_URL from window.CTU_CONFIG (set by config.js)
 *  - Attaches JWT access token as "Authorization: Bearer <token>"
 *  - On 401: attempts one silent token refresh, then retries original request
 *  - On second 401 (refresh also expired): clears tokens, redirects to login
 *  - Throws normalized ApiError objects with { status, message, data }
 *  - Honours CTU_CONFIG.FEATURES.REAL_API flag:
 *      false → throws NotImplementedError (caller should fall back to CTU_DATA mock)
 *      true  → makes the real request
 */

import {
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
  clearTokens,
} from '../utils/jwt.js';

// ─── Config ──────────────────────────────────────────────────────────────────

/** Resolved from config.js global; falls back to localhost for safety. */
const BASE_URL = () => window.CTU_CONFIG?.API_BASE_URL ?? 'http://localhost:8000/api';

/** When REAL_API is false, all client calls bail out immediately. */
const isRealApi = () => window.CTU_CONFIG?.FEATURES?.REAL_API === true;

// ─── Error Types ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  /**
   * @param {number} status   - HTTP status code.
   * @param {string} message  - Human-readable message (from API or fallback).
   * @param {any}   [data]    - Full response body (if parseable).
   */
  constructor(status, message, data = null) {
    super(message);
    this.name   = 'ApiError';
    this.status  = status;
    this.data    = data;
  }
}

export class NotImplementedError extends Error {
  constructor() {
    super('Real API is disabled (FEATURES.REAL_API = false). Use CTU_DATA mock.');
    this.name = 'NotImplementedError';
  }
}

// ─── Internal: Token Refresh ─────────────────────────────────────────────────

let _isRefreshing = false;
let _refreshQueue = []; // Callbacks waiting for a new token

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError(401, 'No refresh token available.');

  const res = await fetch(`${BASE_URL()}/auth/refresh/`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ refresh: refreshToken }),
  });

  if (!res.ok) {
    throw new ApiError(res.status, 'Refresh token expired or invalid.');
  }

  const { access } = await res.json();
  updateAccessToken(access);
  return access;
}

function handleAuthFailure() {
  clearTokens();
  // Determine the correct path depth to login.html
  const depth = window.location.pathname.split('/').filter(Boolean).length;
  const prefix = depth > 1 ? '../'.repeat(depth - 1) : '';
  window.location.href = `${prefix}login.html`;
}

// ─── Internal: Core Fetch ────────────────────────────────────────────────────

/**
 * Core request executor with retry-on-401 logic.
 * @param {string} endpoint   - Path relative to BASE_URL (e.g. '/reports/').
 * @param {RequestInit} opts  - fetch options (method, headers, body, etc.).
 * @param {boolean} [retry=true] - Whether to attempt a token refresh on 401.
 * @returns {Promise<any>} Parsed JSON response body.
 */
async function request(endpoint, opts, retry = true) {
  if (!isRealApi()) throw new NotImplementedError();

  const url     = `${BASE_URL()}${endpoint}`;
  const token   = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    ...(opts.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res;
  try {
    res = await fetch(url, { ...opts, headers });
  } catch (networkErr) {
    throw new ApiError(0, 'Network error — server unreachable.', null);
  }

  // ── 401 handling with single retry ──────────────────────────────────────
  if (res.status === 401 && retry) {
    if (_isRefreshing) {
      // Queue this request until the in-flight refresh completes
      return new Promise((resolve, reject) => {
        _refreshQueue.push({ resolve, reject, endpoint, opts });
      });
    }

    _isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();

      // Drain the queue
      _refreshQueue.forEach(({ resolve, reject, endpoint: ep, opts: o }) => {
        request(ep, o, false).then(resolve).catch(reject);
      });
      _refreshQueue = [];

      // Retry original request with new token
      return await request(endpoint, opts, false);
    } catch {
      // Refresh failed — log out
      _refreshQueue.forEach(({ reject }) => reject(new ApiError(401, 'Session expired.')));
      _refreshQueue = [];
      handleAuthFailure();
      throw new ApiError(401, 'Session expired. Redirecting to login.');
    } finally {
      _isRefreshing = false;
    }
  }

  // ── 204 No Content ──────────────────────────────────────────────────────
  if (res.status === 204) return null;

  // ── Parse body ──────────────────────────────────────────────────────────
  let body;
  const contentType = res.headers.get('Content-Type') ?? '';
  if (contentType.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  // ── Non-2xx errors ──────────────────────────────────────────────────────
  if (!res.ok) {
    const message = body?.detail ?? body?.message ?? `HTTP ${res.status}`;
    throw new ApiError(res.status, message, body);
  }

  return body;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * GET request.
 * @param {string} endpoint  - e.g. '/reports/?status=pending'
 * @returns {Promise<any>}
 */
export function apiGet(endpoint) {
  return request(endpoint, { method: 'GET' });
}

/**
 * POST request.
 * @param {string} endpoint  - e.g. '/reports/'
 * @param {object} body      - JSON-serializable payload.
 * @returns {Promise<any>}
 */
export function apiPost(endpoint, body) {
  return request(endpoint, {
    method: 'POST',
    body:   JSON.stringify(body),
  });
}

/**
 * PATCH request (partial update).
 * @param {string} endpoint  - e.g. '/reports/3/'
 * @param {object} body      - Fields to update.
 * @returns {Promise<any>}
 */
export function apiPatch(endpoint, body) {
  return request(endpoint, {
    method: 'PATCH',
    body:   JSON.stringify(body),
  });
}

/**
 * DELETE request.
 * @param {string} endpoint  - e.g. '/reports/3/'
 * @returns {Promise<null>}  - Resolves null on 204.
 */
export function apiDelete(endpoint) {
  return request(endpoint, { method: 'DELETE' });
}
