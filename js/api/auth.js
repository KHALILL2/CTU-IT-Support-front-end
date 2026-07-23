/**
 * js/api/auth.js
 * Authentication API module.
 *
 * Exports: login(), logout(), me(), getRole
 *
 * When FEATURES.REAL_API = false (default), login() uses a mock JWT so
 * role-based routing can be tested without a live backend.
 *
 * Mock accounts (for testing):
 *   admin@ctu.edu.eg   / any password  → role: 'admin'
 *   anything else      / any password  → role: 'student'
 */

import { apiPost, apiGet, NotImplementedError } from './client.js';
import { saveTokens, clearTokens, getRole as _getRole } from '../utils/jwt.js';

// ── Re-export getRole so callers only need one import ─────────────────────────
export { _getRole as getRole };

// ─── Routing Map ─────────────────────────────────────────────────────────────

const DASHBOARD_BY_ROLE = {
  admin:   'admin/dashboard.html',
  student: 'student/dashboard.html',
};

/**
 * Resolve the correct dashboard path for a given role.
 * Prepends ../ if we are already one directory deep.
 * @param {'student'|'admin'} role
 * @returns {string}
 */
export function dashboardPath(role) {
  const relative = DASHBOARD_BY_ROLE[role] ?? DASHBOARD_BY_ROLE.student;
  // If we're in a subdirectory (e.g. /student/, /admin/), prepend ../
  const depth = window.location.pathname.split('/').filter(Boolean).length;
  return depth > 1 ? `../${relative}` : relative;
}

// ─── Mock JWT Factory ─────────────────────────────────────────────────────────

// TODO: Remove this function once the real Django backend is live.
// Replace mock usage in login() with the real apiPost() call.
function _buildMockJWT(role) {
  // A real JWT has 3 base64url-encoded sections: header.payload.signature
  // We fake all three so decodeJWT() in jwt.js can read the payload.
  const encode = (obj) =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const header  = encode({ alg: 'HS256', typ: 'JWT' });
  const exp     = Math.floor(Date.now() / 1000) + 60 * 60 * 8; // 8 hours
  const payload = encode({ role, exp, sub: 'mock-user', iat: Math.floor(Date.now() / 1000) });
  const sig     = 'mock_signature_not_verified';

  return `${header}.${payload}.${sig}`;
}

/** Build the full mock token payload for saveTokens(). */
function _mockPayload(email) {
  const role = email.toLowerCase().includes('admin') ? 'admin' : 'student';

  const mockUser = role === 'admin'
    ? { id: 1, name: 'Ahmed Hassan',  nameAr: 'أحمد حسن',   email, role }
    : { id: 1, name: 'Ali Mostafa',   nameAr: 'علي مصطفى',  email, role };

  return {
    access:  _buildMockJWT(role),
    refresh: _buildMockJWT(role),
    role,
    user:    mockUser,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Log in with email and password.
 *
 * - In mock mode (FEATURES.REAL_API = false): builds a fake JWT and saves it.
 * - In real mode: calls POST /auth/login/ and saves the returned tokens.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ role: string, user: object }>}
 * @throws {ApiError} On invalid credentials (real mode).
 */
export async function login(email, password) {
  let payload;

  try {
    // ── Real API path ──────────────────────────────────────────────────────
    const data = await apiPost('/auth/login/', { email, password });

    payload = {
      access:  data.access,
      refresh: data.refresh,
      role:    data.user.role,
      user:    data.user,
    };

  } catch (err) {
    if (err instanceof NotImplementedError) {
      // ── TODO: Mock path — remove when backend is live ────────────────────
      await new Promise((r) => setTimeout(r, 800)); // simulate network delay
      payload = _mockPayload(email);
    } else {
      throw err; // Real API error — re-throw so the UI can display it
    }
  }

  saveTokens(payload);
  return { role: payload.role, user: payload.user };
}

/**
 * Log out the current user.
 *
 * - Calls POST /auth/logout/ in real mode (blacklists the refresh token).
 * - Always clears localStorage tokens regardless of API response.
 *
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await apiPost('/auth/logout/', {});
  } catch {
    // Silently ignore — token blacklisting failure should not block local logout
  } finally {
    clearTokens();
  }
}

/**
 * Fetch the currently authenticated user's profile.
 * Falls back to the user stored in the JWT payload when API is in mock mode.
 *
 * @returns {Promise<object>} User object.
 */
export async function me() {
  try {
    return await apiGet('/auth/me/');
  } catch (err) {
    if (err instanceof NotImplementedError) {
      // TODO: Return cached user from token until backend is live
      const stored = JSON.parse(localStorage.getItem('ctu_token') ?? 'null');
      return stored?.user ?? null;
    }
    throw err;
  }
}
