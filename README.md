# CTU Support — Technical Support Hub

A fully responsive, multi-page frontend web application built for the **CTU (Children's Technological University)** IT support team. It serves as a unified portal for students to submit technical issues, and for engineers/admins to manage these reports.

## 🚀 Features
- **Public Portal**: Landing page, problem report form, and authentication screens.
- **Student Dashboard**: Track submitted tickets, attendance stats, and global metrics.
- **Admin Dashboard**: Manage student reports, user directory, system KPIs, and attendance records.
- **Full Localization (i18n)**: Seamlessly toggle between English (LTR) and Arabic (RTL).
- **Dark/Light Mode**: Full theme switching with persistent user preferences.
- **Data Analytics**: Interactive charts powered by Chart.js.
- **Glassmorphism Design**: Modern UI/UX built with CSS variables, custom grid systems, and Bootstrap 5 utilities.

## 🛠️ Technology Stack
- **HTML5 & CSS3** (Vanilla Custom CSS + Bootstrap 5.3)
- **Vanilla JavaScript (ES6)**
- **Chart.js 4.4.1** (Analytics)
- **FontAwesome 6** (Icons)

## 📁 Project Structure
```text
/
├── admin/          # Admin/Engineer dashboard views
├── components/     # Reusable HTML snippets (Navbar, Footer)
├── css/            # Custom styles, animations, design system
├── js/             # Application logic (app.js, data.js, i18n.js)
├── student/        # Student dashboard views
├── webfonts/       # FontAwesome local assets
├── index.html      # Landing Page
├── report.html     # Problem submission form
├── login.html      # Login page
└── signup.html     # Signup page
```

## 🌐 Local Development
Because this project dynamically loads the Navbar and Footer using the `fetch()` API, you **must use a local web server** to preview it locally (to avoid CORS errors on `file:///`).

If you are using VS Code:
1. Install the **Live Server** extension.
2. Right-click `index.html` and select **"Open with Live Server"**.

## 🚀 Deployment (GitHub Pages)
This frontend is completely static and ready to be hosted on GitHub Pages or InfinityFree.
1. Push the code to a GitHub repository.
2. Go to Repo Settings > Pages.
3. Select the `main` branch as the source and click Save.

*Designed & developed for Borg El Arab Technological University.*

## 🔌 API Contract
This frontend interacts with the backend via a REST API (base URL configured in `js/config.js`). The frontend expects the backend to implement the following endpoints:

### Authentication
- `POST /auth/login/` - Accepts `{ email, password }`, returns `{ access, refresh, user: { role, ... } }`.
- `POST /auth/refresh/` - Accepts `{ refresh }`, returns new `{ access }`.
- `POST /auth/logout/` - Blacklists the token.
- `GET /auth/me/` - Returns the current authenticated user profile.

### Attendance
- `GET /attendance/` - Returns attendance records. Admin gets all, Student gets their own.
- `POST /attendance/register/` - Student self-registration (sign attendance).
- `POST /attendance/` - Admin creates a new attendance day.
- `PATCH /attendance/{id}/` - Admin modifies a day.

### Meetings
- `GET /meetings/` - Returns upcoming meetings based on user role.
- `POST /meetings/` - Admin creates a new meeting.
- `PATCH /meetings/{id}/` - Admin updates meeting status (e.g., active/completed).
- `DELETE /meetings/{id}/` - Admin deletes a meeting.

### Availability
- `GET /availability/` - Admin views all students' availability; Student views their own status.
- `POST /availability/` - Student sets their current status (available/unavailable).

### Reports/Tickets
- `GET /reports/` - Admin gets all reports, Student gets their own.
- `POST /reports/` - Student submits a new problem report.
- `PATCH /reports/{id}/` - Admin updates report status.
- `DELETE /reports/{id}/` - Admin deletes a report.

All authenticated endpoints require an `Authorization: Bearer <access_token>` header. For a detailed JSON schema for requests/responses, consult the internal `.agents/rules/api-contract.md`.
