# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.1] - 2026-08-06

### Fixed
- **Dark Mode Flash (FOUC)**: Added a synchronous `<script>` block in the `<head>` of all HTML files to immediately apply the saved `data-theme` before CSS parsing, eliminating the bright flash on page transitions.
- **Infinite Loading Screen**: Added `typeof` checks to `app.js` for i18n functions (`getCurrentLang`, `t`). This allows the layout script to degrade gracefully on pages where `i18n.js` is intentionally omitted, successfully bypassing the stuck loading state.
- **Loading Overlay Blink**: Set `.loading-screen` to `display: none !important` globally in `main.css` since the static MPA architecture reloads the full page, causing the loading div to create a disruptive blink.
- **Dark Mode Tables**: Added an override block in `main.css` to force Bootstrap's `.table` components to respect `[data-theme="dark"]` background and text colors, fixing the glaring white tables in dark mode.

## [2.1.0] - 2026-08-06

### Added
- **Mock Login System**: Replaced the broken ES Module auth system with an inline mock script in `login.html` to allow static hosting (e.g., GitHub Pages) navigation without a PHP backend.
- Demo credentials block added directly to the login interface for easy access.

### Changed
- **Directory Restructuring**: Replaced the `staff` and `student` directories with `support` and `lab-supervisor` directories to better reflect the system roles.
- **File Renaming**: Prefixed all dashboard HTML files with their respective roles (e.g., `admin-overview.html`, `support-users.html`, `lab-supervisor-dashboard.html`) to prevent naming collisions and improve backend routing clarity.
- **Performance Optimization**: Removed the 600ms artificial delay in `app.js` and reduced the CSS loading screen transition to 0.15s, significantly speeding up perceived page loads.
- Form methods in all dashboards standardized to `POST` in preparation for backend integration.

## [2.0.0] - 2026-08-03

### Added
- **Major Folders by User Type**: Created isolated, dedicated HTML pages organized into `/admin`, `/staff`, and `/student` directories for much easier backend routing and integration.
- Standard form `POST` methods added to `login.html` and `report.html` for native server handling.
- URL Parameter checking in `report.html` to automatically trigger the Success modal if `?success=1` is present.
- Added new click-based `<select>` interface in `admin/issues.html` and `staff/issues.html` for modifying issue statuses (replacing the old Kanban drag-and-drop).

### Changed
- **Architectural Shift**: Completely transitioned the project from a Javascript-driven Single Page Application (SPA) to a static Multi-Page Application (MPA).
- Inlined the Navbar, Header, and Footer components directly into every page to simplify PHP includes.
- Migrated all documentation from `docs/FRONTEND_ARCHITECTURE.md` to `docs/FRONTEND_GUIDE.md` and `docs/BACKEND_INTEGRATION_GUIDE.md` to reflect the new architecture.

### Removed
- **Javascript Framework**: Eliminated the entire custom vanilla JS router (`js/router/`), view models (`js/views/`), and mock API logic (`js/api/`).
- Removed `js/data.js` and all local-storage persistence logic to pave the way for true database integration.
- Removed the Kanban drag-and-drop script in the issues tab.

## [1.0.0] - 2026-07-25

### Added
- Initial Release of the CTU Support Hub frontend.
- Single Page Application (SPA) architecture utilizing vanilla Javascript and hash-based routing.
- Responsive design with touch-friendly targets for mobile devices.
- LocalStorage mock database for testing (Authentication, Issues, Reports).
- Dark/Light mode theme switching and LTR/RTL (English/Arabic) internationalization.
