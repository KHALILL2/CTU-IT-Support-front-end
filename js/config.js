/**
 * CTU Support — Application Configuration
 * 
 * Central configuration for API endpoints, auth tokens, and polling intervals.
 * This file is loaded as a classic <script> for backward compatibility with
 * legacy globals (app.js, i18n.js, data.js). New modules should import from
 * the ES module version below.
 */

// ─── API ────────────────────────────────────────────────────────────────────────
const API_BASE_URL = 'http://localhost:8000/api';

// ─── Auth ───────────────────────────────────────────────────────────────────────
const TOKEN_KEY    = 'ctu_token';       // localStorage key for { access, refresh, role }
const AUTH_TOKEN_LEGACY = 'ctu_auth_token'; // Legacy key used by existing inline guards

// ─── Polling Intervals (ms) ─────────────────────────────────────────────────────
const POLL_REPORTS_MS    = 30_000;  // Refresh reports table every 30s
const POLL_ATTENDANCE_MS = 15_000;  // Refresh attendance status every 15s
const POLL_MEETINGS_MS   = 60_000;  // Refresh meetings list every 60s

// ─── Roles ──────────────────────────────────────────────────────────────────────
const ROLES = Object.freeze({
  STUDENT: 'student',
  ADMIN:   'admin',
});

// ─── Route Maps ─────────────────────────────────────────────────────────────────
const DASHBOARD_ROUTES = Object.freeze({
  [ROLES.STUDENT]: 'student/dashboard.html',
  [ROLES.ADMIN]:   'admin/dashboard.html',
});

// ─── Feature Flags ──────────────────────────────────────────────────────────────
const FEATURES = Object.freeze({
  MEETINGS:     false,  // Enable when meetings endpoints are ready
  AVAILABILITY: false,  // Enable when availability endpoints are ready
  REAL_API:     false,  // false = use CTU_DATA mock; true = hit API_BASE_URL
});

// ─── Export for ES Modules ──────────────────────────────────────────────────────
// When this file is imported as a module (future migration), these will be available.
// For now it also sets globals so legacy scripts can access them.
if (typeof window !== 'undefined') {
  window.CTU_CONFIG = Object.freeze({
    API_BASE_URL,
    TOKEN_KEY,
    AUTH_TOKEN_LEGACY,
    POLL_REPORTS_MS,
    POLL_ATTENDANCE_MS,
    POLL_MEETINGS_MS,
    ROLES,
    DASHBOARD_ROUTES,
    FEATURES,
  });
}
