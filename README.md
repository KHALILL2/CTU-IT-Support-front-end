# CTU Support — Technical Support Hub

A highly responsive, multi-role Static HTML/CSS template built for the **CTU (Children's Technological University)** IT support team. It serves as a unified portal for Lab Supervisors to submit technical issues, IT Support engineers to resolve them, and Administrators to oversee the entire system.

> **Note to Developers:** This frontend has been deliberately restructured into a pure Static Multi-Page Application (MPA) template to allow for seamless integration with a server-side backend (e.g., PHP, Node.js, Python).

## 🚀 Features

- **Public Portal**: Landing page, team showcase, and unified authentication screen.
- **Three-Tier Role System Dashboard Templates**:
  - **Administrator (`/admin`)**: Global oversight, user directory management, audit logs, and master views for attendance, issues, and reports.
  - **Lab Supervisor (`/lab-supervisor`)**: Report hardware/software issues in labs, submit daily operation reports, and log attendance/meetings.
  - **IT Support (`/support`)**: Receive issue tickets, manage repairs via a touch-friendly mobile grid, update statuses, and escalate problems.
- **100% Mobile Responsive**: Designed specifically for touch devices. Native-feeling sidebars, touch-friendly UI components (44px min-height targets).
- **CSS-Driven Theming & i18n**: Fully equipped with CSS variables for Light/Dark mode and LTR/RTL support (English/Arabic).

## 🛠️ Technology Stack

- **HTML5** (Semantic, accessible markup)
- **CSS3** (Vanilla Custom CSS + Bootstrap 5.3 Grid/Utilities)
- **Vanilla JavaScript** (Used strictly for lightweight UI toggles like sidebars)
- **Chart.js 4.4.1** (Analytics placeholders)
- **FontAwesome 6** (Icons)

## 📁 Project Structure

```text
/
├── admin/          # Administrator dashboard views
├── lab-supervisor/ # Lab Supervisor dashboard views
├── support/        # IT Support dashboard views
├── css/            # Custom styles, animations, design system
├── docs/           # 📖 DEVELOPER DOCUMENTATION (Read this first!)
├── js/             # Lightweight UI scripts (sidebar toggles, theme switching)
├── components/     # Reusable HTML snippets (e.g., sidebar.html) for PHP includes
├── images/         # Static media assets
├── index.html      # Landing Page
└── login.html      # Unified Login Page
```

## 📖 Developer Documentation

If you are a developer taking over this project to integrate a backend or modify the UI, **you MUST read the documentation in the `/docs` folder**:

- **Frontend Developers**: Read [`docs/FRONTEND_GUIDE.md`](docs/FRONTEND_GUIDE.md) to understand the CSS architecture, layout structures, and how to maintain the UI design system.
- **Backend Developers**: Read [`docs/BACKEND_INTEGRATION_GUIDE.md`](docs/BACKEND_INTEGRATION_GUIDE.md) to learn how to wire up these static templates to a database, implement session authentication, and dynamically populate the tables and forms using PHP (or your chosen backend language).

## 🌐 Local Development

Because this is a pure static HTML template, no build step or node server is strictly required to view the UI.

Simply open any `.html` file in your browser, or if you are using VS Code:
1. Install the **Live Server** extension.
2. Right-click `index.html` and select **"Open with Live Server"**.

*Designed & developed for Borg El Arab Technological University.*
