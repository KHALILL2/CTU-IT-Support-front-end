# CTU Support — Technical Support Hub

A fully responsive, multi-role SPA (Single Page Application) frontend web application built for the **CTU (Children's Technological University)** IT support team. It serves as a unified portal for Lab Supervisors to submit technical issues, IT Support engineers to resolve them, and Administrators to oversee the entire system.

## 🚀 Features

- **Public Portal**: Landing page, team showcase, and unified authentication screen.
- **Three-Tier Role System**:
  - **Lab Supervisor**: Report hardware/software issues in labs, submit daily operation reports, and log attendance/meetings.
  - **IT Support**: Receive issue tickets, manage repairs via a touch-friendly mobile grid, update statuses, and escalate problems.
  - **Administrator**: Global oversight, user directory management, audit logs, and master views for attendance, issues, and reports.
- **100% Mobile Responsive**: Designed specifically for touch devices. Native-feeling sidebars, touch-friendly UI components (44px min-height targets), and zero reliance on hover-states or drag-and-drop.
- **Full Localization (i18n)**: Seamlessly toggle between English (LTR) and Arabic (RTL) across the entire application without reloading.
- **Dark/Light Mode**: Full theme switching with persistent user preferences.
- **Data Analytics**: Interactive charts powered by Chart.js.
- **Persistent Mock Storage**: Data is seamlessly stored in browser `localStorage` to ensure persistence across page reloads during development/testing.

## 🛠️ Technology Stack

- **HTML5 & CSS3** (Vanilla Custom CSS + Bootstrap 5.3)
- **Vanilla JavaScript (ES6 Modules)**
- **Chart.js 4.4.1** (Analytics)
- **FontAwesome 6** (Icons)

## 📁 Project Structure

```text
/
├── admin/          # Admin dashboard shell (dashboard.html)
├── css/            # Custom styles, animations, design system
├── docs/           # 📖 DEVELOPER DOCUMENTATION (Read this first!)
├── js/             # Application logic (SPA Router, API services, UI components)
│   ├── api/        # Mock API modules (auth.js, issues.js, reports.js)
│   ├── components/ # Reusable UI builders (sidebar, modal, toast, skeleton)
│   ├── router/     # Vanilla JS hash-based router (dashboardRouter.js)
│   ├── views/      # Individual page views mapped to routes
│   └── data.js     # Mock database with localStorage persistence
├── staff/          # Staff dashboard shell for Lab & IT (dashboard.html)
├── webfonts/       # FontAwesome local assets
├── index.html      # Landing Page
└── login.html      # Unified Login Page
```

## 📖 Developer Documentation

If you are taking over this project (either as a Frontend or Backend developer), **you MUST read the documentation in the `/docs` folder**:

- **Frontend Developers**: Read [`docs/FRONTEND_ARCHITECTURE.md`](docs/FRONTEND_ARCHITECTURE.md) to understand the SPA routing, CSS styling rules, and how views are dynamically injected.
- **Backend Developers**: Read [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) to understand the exact JSON schemas and endpoints the frontend expects you to build.

## 🌐 Local Development

Because this project utilizes ES6 Modules (`import` / `export`), you **must use a local web server** to preview it locally.

If you are using VS Code:
1. Install the **Live Server** extension.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Test Accounts
You can test the application using the following built-in mock accounts (password is `123456` for all):
- **Admin**: `admin@ctu.edu.eg`
- **Lab Supervisor**: `lab@ctu.edu.eg`
- **IT Support**: `support@ctu.edu.eg`

## 🚀 Deployment (GitHub Pages)
This frontend is completely static and ready to be hosted on GitHub Pages or InfinityFree.
1. Push the code to a GitHub repository.
2. Go to Repo Settings > Pages.
3. Select the `main` branch as the source and click Save.

*Designed & developed for Borg El Arab Technological University.*
