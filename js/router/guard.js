import { isAuthenticated, getRole } from '../utils/jwt.js';
import { dashboardPath } from '../api/auth.js';

/**
 * Ensures the user is authenticated.
 * If not, redirects to the login page.
 * @throws {Error} If not authenticated.
 */
export function requiresAuth() {
  if (!isAuthenticated()) {
    // Determine if we are in a subdirectory
    const pathParts = window.location.pathname.split('/');
    const currentFolder = pathParts[pathParts.length - 2];
    const isSubdir = currentFolder === 'admin' || currentFolder === 'student';
    window.location.href = isSubdir ? '../login.html' : 'login.html';
    throw new Error('Not authenticated, redirecting to login');
  }
}

/**
 * Ensures the user has a specific role.
 * Redirects to the correct dashboard if there is a role mismatch.
 * @param {'student'|'admin'} expectedRole 
 * @throws {Error} If role mismatch.
 */
export function requiresRole(expectedRole) {
  requiresAuth();
  
  const currentRole = getRole();
  if (currentRole !== expectedRole) {
    window.location.href = dashboardPath(currentRole);
    throw new Error(`Role mismatch. Expected ${expectedRole}, got ${currentRole}. Redirecting.`);
  }
}
