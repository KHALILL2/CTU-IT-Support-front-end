/**
 * js/utils/date.js
 * Date formatting and calendar utilities.
 * 
 * Extracted from app.js:formatDate() and extended for calendar / attendance use.
 */

// ─── Locale-Aware Formatting ─────────────────────────────────────────────────

/**
 * Format a date string or Date object for display, respecting the current lang.
 * @param {string|Date} dateInput - ISO date string (YYYY-MM-DD) or Date object.
 * @param {'en'|'ar'}  [lang]    - Override; defaults to localStorage 'ctu-lang'.
 * @param {Intl.DateTimeFormatOptions} [opts] - Override Intl options.
 * @returns {string}
 */
export function formatDate(dateInput, lang, opts) {
  const locale   = lang ?? localStorage.getItem('ctu-lang') ?? 'en';
  const intlLang = locale === 'ar' ? 'ar-EG' : 'en-US';
  const date     = dateInput instanceof Date ? dateInput : new Date(dateInput + 'T00:00:00');
  const options  = opts ?? { year: 'numeric', month: 'short', day: 'numeric' };

  return date.toLocaleDateString(intlLang, options);
}

/**
 * Format a date as a short label (e.g. "Jul 18" / "١٨ يوليو").
 * @param {string|Date} dateInput
 * @param {'en'|'ar'}  [lang]
 * @returns {string}
 */
export function formatDateShort(dateInput, lang) {
  return formatDate(dateInput, lang, { month: 'short', day: 'numeric' });
}

/**
 * Format a date as a full weekday label (e.g. "Wednesday, July 18, 2026").
 * @param {string|Date} dateInput
 * @param {'en'|'ar'}  [lang]
 * @returns {string}
 */
export function formatDateFull(dateInput, lang) {
  return formatDate(dateInput, lang, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Date Arithmetic ─────────────────────────────────────────────────────────

/**
 * Return today's date as an ISO string (YYYY-MM-DD).
 * @returns {string}
 */
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Return true if two ISO date strings represent the same calendar day.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function isSameDay(a, b) {
  return a.slice(0, 10) === b.slice(0, 10);
}

/**
 * Return true if the ISO date string is today.
 * @param {string} dateStr
 * @returns {boolean}
 */
export function isToday(dateStr) {
  return isSameDay(dateStr, todayISO());
}

/**
 * Get an array of ISO date strings for every day in a given month.
 * @param {number} year  - Full year, e.g. 2026.
 * @param {number} month - 0-indexed month (0 = January).
 * @returns {string[]}
 */
export function getDaysInMonth(year, month) {
  const days   = [];
  const date   = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(date.toISOString().slice(0, 10));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

/**
 * Return a human-readable relative label ("Today", "Yesterday", or formatted date).
 * @param {string} dateStr - ISO date string.
 * @param {'en'|'ar'} [lang]
 * @returns {string}
 */
export function relativeDate(dateStr, lang) {
  const locale = lang ?? localStorage.getItem('ctu-lang') ?? 'en';
  const ar     = locale === 'ar';

  if (isToday(dateStr)) return ar ? 'اليوم'        : 'Today';

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(dateStr, yesterday.toISOString())) return ar ? 'أمس' : 'Yesterday';

  return formatDate(dateStr, locale);
}
