/**
 * js/api/auth.js
 * Authentication API module.
 *
 * Exports: login(), logout(), me(), getRole, dashboardPath()
 *
 * When FEATURES.REAL_API = false (default), login() uses a mock JWT so
 * role-based routing can be tested without a live backend.
 *
 * Mock accounts (for testing):
 *   *admin*         → role: 'admin'
 *   *lab*           → role: 'lab_supervisor'
 *   anything else   → role: 'it_support'
 */

import { apiPost, apiGet, NotImplementedError } from './client.js';
import { saveTokens, clearTokens, getRole as _getRole } from '../utils/jwt.js';

// ── Re-export getRole so callers only need one import ─────────────────────────
export { _getRole as getRole };

// ─── Routing Map ─────────────────────────────────────────────────────────────

const DASHBOARD_BY_ROLE = {
  admin:          'admin/dashboard.html',
  lab_supervisor: 'staff/dashboard.html',
  it_support:     'staff/dashboard.html',
};

/**
 * Resolve the correct dashboard path for a given role.
 * Prepends ../ if we are already one directory deep.
 * @param {'admin'|'lab_supervisor'|'it_support'} role
 * @returns {string}
 */
export function dashboardPath(role) {
  const relative = DASHBOARD_BY_ROLE[role] ?? DASHBOARD_BY_ROLE.it_support;
  const pathParts = window.location.pathname.split('/');
  const currentFolder = pathParts[pathParts.length - 2];
  const isSubdir = ['admin', 'student', 'staff'].includes(currentFolder);
  return isSubdir ? `../${relative}` : relative;
}

// ─── Mock JWT Factory ─────────────────────────────────────────────────────────

function _buildMockJWT(role) {
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

/** Determine mock role from email pattern. */
function _resolveRole(email) {
  const lower = email.toLowerCase();
  if (lower.includes('admin')) return 'admin';
  if (lower.includes('lab'))   return 'lab_supervisor';
  return 'it_support';
}

/** Role display labels. */
const ROLE_LABELS = {
  admin:          'Administrator',
  lab_supervisor: 'Lab Supervisor',
  it_support:     'IT Support',
};

/** Build the full mock token payload for saveTokens(). */
function _mockPayload(email) {
  const role = _resolveRole(email);

  const mockUsers = {
    admin:          { id: 1, name: 'Ahmed Hassan',   nameAr: 'أحمد حسن',    email, role, department: 'IT Administration' },
    lab_supervisor: { id: 2, name: 'Sara Mohamed',   nameAr: 'سارة محمد',   email, role, department: 'Lab Operations' },
    it_support:     { id: 3, name: 'Ali Mostafa',    nameAr: 'علي مصطفى',   email, role, department: 'Technical Support' },
  };

  return {
    access:  _buildMockJWT(role),
    refresh: _buildMockJWT(role),
    role,
    user:    mockUsers[role],
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Log in with email and password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ role: string, user: object }>}
 * @throws {ApiError} On invalid credentials (real mode).
 */
export async function login(email, password) {
  let payload;

  try {
    const data = await apiPost('/auth/login/', { email, password });

    payload = {
      access:  data.access,
      refresh: data.refresh,
      role:    data.user.role,
      user:    data.user,
    };

  } catch (err) {
    if (err instanceof NotImplementedError) {
      await new Promise((r) => setTimeout(r, 800));
      payload = _mockPayload(email);
    } else {
      throw err;
    }
  }

  saveTokens(payload);
  return { role: payload.role, user: payload.user };
}

/**
 * Log out the current user.
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await apiPost('/auth/logout/', {});
  } catch {
    // Silently ignore
  } finally {
    clearTokens();
  }
}

/**
 * Fetch the currently authenticated user's profile.
 * @returns {Promise<object>} User object.
 */
export async function me() {
  try {
    return await apiGet('/auth/me/');
  } catch (err) {
    if (err instanceof NotImplementedError) {
      const stored = JSON.parse(localStorage.getItem('ctu_token') ?? 'null');
      return stored?.user ?? null;
    }
    throw err;
  }
}

/** Export role labels for UI display. */
export { ROLE_LABELS };
