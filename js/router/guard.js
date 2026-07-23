import { isAuthenticated, getRole } from '../utils/jwt.js';
import { dashboardPath } from '../api/auth.js';

/**
 * Ensures the user is authenticated.
 * If not, redirects to the login page.
 * @throws {Error} If not authenticated.
 */
export function requiresAuth() {
  if (!isAuthenticated()) {
    // Determine the correct path depth to login.html
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    const prefix = depth > 1 ? '../'.repeat(depth - 1) : '';
    window.location.href = `${prefix}login.html`;
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
