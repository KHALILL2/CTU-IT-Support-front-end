# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
