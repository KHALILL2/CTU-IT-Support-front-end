import { isAuthenticated, getRole } from '../utils/jwt.js';
import { dashboardPath } from '../api/auth.js';

/**
 * Ensures the user is authenticated.
 * If not, redirects to the login page.
 * @throws {Error} If not authenticated.
 */
export function requiresAuth() {
  if (!isAuthenticated()) {
    const pathParts = window.location.pathname.split('/');
    const currentFolder = pathParts[pathParts.length - 2];
    const isSubdir = ['admin', 'student', 'staff'].includes(currentFolder);
    window.location.href = isSubdir ? '../login.html' : 'login.html';
    throw new Error('Not authenticated, redirecting to login');
  }
}

/**
 * Ensures the user has one of the expected roles.
 * Redirects to the correct dashboard if there is a role mismatch.
 * @param {string|string[]} expectedRoles - A single role string or array of allowed roles.
 * @throws {Error} If role mismatch.
 */
export function requiresRole(expectedRoles) {
  requiresAuth();

  const allowed = Array.isArray(expectedRoles) ? expectedRoles : [expectedRoles];
  const currentRole = getRole();

  if (!allowed.includes(currentRole)) {
    window.location.href = dashboardPath(currentRole);
    throw new Error(`Role mismatch. Expected one of [${allowed.join(', ')}], got ${currentRole}. Redirecting.`);
  }
}
