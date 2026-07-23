/**
 * js/utils/jwt.js
 * JWT token management helpers.
 *
 * Token storage format in localStorage (key: TOKEN_KEY = 'ctu_token'):
 *   { access: "eyJ...", refresh: "eyJ...", role: "student"|"admin", user: {...} }
 *
 * Legacy key: 'ctu_auth_token' — used by inline HTML guards during migration.
 * Both keys are written on login so old guards keep working until replaced.
 */

const TOKEN_KEY        = 'ctu_token';
const TOKEN_KEY_LEGACY = 'ctu_auth_token';

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Get the full token payload object from localStorage.
 * @returns {{ access: string, refresh: string, role: string, user: object }|null}
 */
export function getTokenPayload() {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch { return null; }
}

/**
 * Get the access token string.
 * @returns {string|null}
 */
export function getAccessToken() {
  return getTokenPayload()?.access ?? null;
}

/**
 * Get the refresh token string.
 * @returns {string|null}
 */
export function getRefreshToken() {
  return getTokenPayload()?.refresh ?? null;
}

/**
 * Get the authenticated user's role.
 * @returns {'student'|'admin'|null}
 */
export function getRole() {
  return getTokenPayload()?.role ?? null;
}

/**
 * Get the authenticated user object.
 * @returns {object|null}
 */
export function getUser() {
  return getTokenPayload()?.user ?? null;
}

/**
 * Return true if there is a stored access token (user is logged in).
 * @returns {boolean}
 */
export function isAuthenticated() {
  return Boolean(getAccessToken());
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Persist a full token payload after login or signup.
 * Also writes the legacy key so existing inline HTML guards keep working.
 *
 * @param {{ access: string, refresh: string, role: string, user: object }} payload
 */
export function saveTokens(payload) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(payload));
  // Write legacy key so inline <script> guards in existing HTML still work
  localStorage.setItem(TOKEN_KEY_LEGACY, payload.access);
}

/**
 * Update only the access token after a successful refresh.
 * @param {string} newAccessToken
 */
export function updateAccessToken(newAccessToken) {
  const payload = getTokenPayload();
  if (!payload) return;
  payload.access = newAccessToken;
  localStorage.setItem(TOKEN_KEY, JSON.stringify(payload));
  localStorage.setItem(TOKEN_KEY_LEGACY, newAccessToken);
}

// ─── Clear ────────────────────────────────────────────────────────────────────

/**
 * Remove all token data from localStorage (logout).
 * Clears both the new key and the legacy key.
 */
export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY_LEGACY);
}

// ─── Decode (no-verify, for expiry checks) ────────────────────────────────────

/**
 * Decode a JWT payload (base64url → JSON). Does NOT verify the signature.
 * Use only for reading expiry / claims on the client side.
 *
 * @param {string} token - A JWT string.
 * @returns {object|null} Decoded payload, or null if malformed.
 */
export function decodeJWT(token) {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

/**
 * Return true if the access token's `exp` claim is in the past (expired).
 * Returns true also if there is no token.
 * @returns {boolean}
 */
export function isTokenExpired() {
  const token = getAccessToken();
  if (!token) return true;
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;
  // exp is in seconds; Date.now() is in ms
  return Date.now() >= payload.exp * 1000;
}
