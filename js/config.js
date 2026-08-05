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
const POLL_ISSUES_MS     = 30_000;  // Refresh issue board every 30s
const POLL_CUSTODY_MS    = 60_000;  // Refresh custody list every 60s

// ─── Roles ──────────────────────────────────────────────────────────────────────
const ROLES = Object.freeze({
  ADMIN:          'admin',
  LAB_SUPERVISOR: 'lab_supervisor',
  IT_SUPPORT:     'it_support',
});

// ─── Route Maps ─────────────────────────────────────────────────────────────────
const DASHBOARD_ROUTES = Object.freeze({
  [ROLES.ADMIN]:          'admin/admin-overview.html',
  [ROLES.LAB_SUPERVISOR]: 'lab-supervisor/lab-supervisor-dashboard.html',
  [ROLES.IT_SUPPORT]:     'support/support-overview.html',
});

// ─── Feature Flags ──────────────────────────────────────────────────────────────
const FEATURES = Object.freeze({
  MEETINGS:      false,  // Enable when meetings endpoints are ready
  AVAILABILITY:  false,  // Enable when availability endpoints are ready
  ISSUES:        false,  // Enable when issues endpoints are ready
  CUSTODY:       false,  // Enable when custody endpoints are ready
  DAILY_REPORTS: false,  // Enable when daily reports endpoints are ready
  AUDIT_LOG:     false,  // Enable when audit log endpoints are ready
  REAL_API:      false,  // false = use CTU_DATA mock; true = hit API_BASE_URL
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
    POLL_ISSUES_MS,
    POLL_CUSTODY_MS,
    ROLES,
    DASHBOARD_ROUTES,
    FEATURES,
  });
}
