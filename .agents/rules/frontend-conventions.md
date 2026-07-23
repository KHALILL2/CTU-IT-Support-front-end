---
description: Frontend coding conventions, CSS patterns, and JS module standards.
activation:
  - path: "js/**"
  - path: "css/**"
  - path: "*.html"
---

# Frontend Conventions

## JavaScript

### Module System
- All **new** JS files must use ES Module syntax (`export` / `import`).
- HTML pages load new modules via `<script type="module" src="..."></script>`.
- Legacy globals (`app.js`, `i18n.js`, `data.js`) are still loaded as classic scripts during migration. Do not import them as modules yet.

### File Organization
| Directory         | Purpose                                      |
|-------------------|----------------------------------------------|
| `js/config.js`    | Constants: API URL, token key, poll intervals |
| `js/api/`         | HTTP client, auth helpers                    |
| `js/router/`      | Auth guards, role-based redirect             |
| `js/components/`  | Shared UI: toast, modal, sidebar              |
| `js/views/admin/` | Admin page-specific logic                    |
| `js/views/student/` | Student page-specific logic                |
| `js/utils/`       | Pure functions: formatDate, animateCounter   |

### Naming Conventions
- Files: `kebab-case.js` (e.g., `api-client.js`).
- Functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE`.
- CSS classes: `kebab-case` (e.g., `.stat-card`, `.sidebar-link`).

### Error Handling
- All `fetch()` calls must be wrapped in try/catch.
- On 401: attempt token refresh via `api/client.js` before redirecting.
- Show user-facing errors via `showToast(message, 'error')`.

---

## CSS

### Design Tokens
All colors, spacing, shadows, and radii are defined as CSS custom properties in `css/main.css` under `:root` and `[data-theme="dark"]`. Never use hardcoded hex colors in component CSS—always reference tokens.

### Key Token Groups
- **Palette**: `--primary-{50-900}`, `--accent-{400-700}`, `--secondary-{400-600}`
- **Semantic**: `--bg-primary`, `--text-primary`, `--border-default`
- **Glass**: `--bg-glass`, `--bg-glass-strong`, `--border-glass`
- **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-glow`
- **Radii**: `--radius-sm` (6px), `--radius-md` (10px), `--radius-lg` (16px), `--radius-xl` (24px), `--radius-full` (9999px)
- **Transitions**: `--transition-base` (0.3s ease), `--transition-theme` (0.5s ease)

### File Responsibilities
| File              | Scope                                  |
|-------------------|----------------------------------------|
| `main.css`        | Tokens, reset, typography, utilities   |
| `components.css`  | Buttons, cards, forms, hero, modals    |
| `dashboard.css`   | Sidebar, topbar, stat cards, tables    |
| `animations.css`  | Keyframes, scroll-reveal, transitions  |

### Responsive Breakpoints
- `1024px`: Tablet — collapse 4-col grids to 2-col.
- `768px`: Mobile — show hamburger, stack grids to 1-col.
- `640px`: Small mobile — single column everything.

---

## HTML

### Shared Components
- Navbar and Footer are loaded dynamically via `fetch()` from `components/navbar.html` and `components/footer.html`. They inject into `#navbar-placeholder` and `#footer-placeholder`.
- Dashboard pages do NOT use the shared navbar/footer—they have their own sidebar.

### i18n Pattern
- Static text: `<span data-i18n="key">Fallback</span>`
- Placeholders: `<input data-i18n-placeholder="key" placeholder="Fallback">`
- Dynamic text in JS: use `t('key')` from `i18n.js`.
- Bilingual data fields: use `getLocalized(obj, 'field')`.

### Auth Guard
- Dashboard pages include an inline `<script>` in `<head>` that checks `localStorage.getItem('ctu_auth_token')` and redirects to login. This will be replaced by `js/router/auth.js` in the modular migration.

### Script Loading Order (Legacy)
```html
<script src="js/bootstrap.bundle.min.js"></script>
<script src="js/data.js"></script>
<script src="js/i18n.js"></script>
<script src="js/app.js"></script>
<script>
  // Page-specific inline logic
</script>
```
New modules should be loaded separately via `<script type="module">`.
