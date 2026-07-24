# Frontend Architecture Guide

Welcome to the CTU IT Support frontend! This document outlines how the application is built so that future frontend developers can easily maintain and extend it.

## 1. Core Philosophy

- **Vanilla JS (ES6)**: No React, Vue, or Angular. We rely heavily on native ES6 Modules (`import`/`export`), Template Literals, and DOM manipulation (`document.createElement`).
- **Single Page Application (SPA)**: The dashboards (`/admin/dashboard.html` and `/staff/dashboard.html`) never reload. Navigating between tabs dynamically destroys the old view and mounts a new view in the `#view` container.
- **Role-Based CSS**: UI elements meant only for specific roles (e.g. Lab Supervisors vs IT Support) are hidden/shown using high-level body classes like `.role-lab`, `.role-it`, and `.role-admin`.

## 2. Directory Structure

```text
/css/
  ├── main.css         # Global resets, typography, and CSS variables (Theming)
  ├── components.css   # Reusable UI (buttons, cards, forms, inputs)
  ├── dashboard.css    # Dashboard layout (Sidebar, Topbar, Grid)
  └── staff.css / admin.css # Role-specific overrides

/js/
  ├── app.js           # Global entrypoint (Theme switching, lang toggling)
  ├── data.js          # Mock database with localStorage persistence
  ├── i18n.js          # Internationalization dictionary & translation logic
  │
  ├── api/             # API Adapters (See docs/API_CONTRACT.md)
  │   ├── auth.js      # Login, Logout, Session management
  │   ├── issues.js    # Issue reporting, fetching, updating
  │   └── reports.js   # Daily reports fetching, submitting
  │
  ├── components/      # Pure functions returning DOM elements
  │   ├── modal.js     # Global modal system (openModal, closeModal)
  │   ├── sidebar.js   # Dynamically builds the sidebar based on role
  │   ├── toast.js     # Toast notification system
  │   └── badge.js     # Status/Priority badges
  │
  ├── router/
  │   ├── dashboardRouter.js # Hash-based SPA routing engine
  │   └── guard.js           # Redirects unauthenticated/unauthorized users
  │
  └── views/           # The actual Pages. Each file exports `render(container)`
      ├── admin/       # Admin views (overview, users, issues, etc)
      └── staff/       # Staff views (overview, attendance, issues, custody)
```

## 3. The Router & Views

When a user navigates to `#issues`, the `dashboardRouter.js` intercepts the hash change, clears the main `#view` container, dynamically imports the corresponding view file (e.g. `js/views/staff/issues.js`), and calls its `render(container, role)` function.

### How to Build a View

Every file in `js/views/` must export an async `render` function:

```javascript
import { getIssues } from '../../api/issues.js';

export async function render(container, role) {
  // 1. Clear previous content
  container.innerHTML = '';
  
  // 2. Fetch data
  const issues = await getIssues();

  // 3. Build DOM
  const title = document.createElement('h2');
  title.textContent = 'Issue Management';
  container.appendChild(title);

  // 4. Return cleanup function (Optional)
  // If your view sets up `setInterval` or global event listeners, 
  // return a function here to clean them up when the user leaves the page.
  return () => {
    console.log("Cleanup when leaving the view");
  };
}
```

## 4. State & Data Fetching (The Mock API)

Currently, there is no real backend. The application uses a robust mock data layer.
- **`js/data.js`**: Contains `window.CTU_DATA` (the database) and `window.saveMockData()` which saves the state to `localStorage`.
- **API Adapters (`js/api/*.js`)**: These functions simulate backend latency (`delay(500)`), mutate `window.CTU_DATA`, and call `saveMockData()`.

**To integrate the real backend later**, you simply replace the functions inside `js/api/*.js` with standard `fetch()` calls returning JSON. The UI views will not need to change.

## 5. Mobile Responsiveness & Touch UI

- We use a **Mobile-First CSS Grid**.
- **Touch Targets**: All `.btn` and `.form-input` elements have a strict `min-height: 44px`.
- **Text Size**: Inputs use a strict `16px` font size to prevent iOS Safari auto-zooming.
- **Hover States**: The application does not rely on CSS `:hover` for any critical functionality, ensuring 100% compatibility with touch screens.

## 6. Theming & i18n

- **Dark/Light Mode**: Governed by `data-theme="light|dark"` on the `<html>` tag. Colors are defined in `main.css` as `--bg-primary`, `--text-primary`, etc.
- **Localization**: Elements with `data-i18n="key"` are automatically translated by `js/i18n.js`. When the language changes, `dir="rtl"` is applied to the HTML tag, and CSS uses logical properties (`margin-inline-start`, `[dir="rtl"]`) to mirror the layout.
