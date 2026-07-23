---
description: Project architecture, tech stack, and domain context for CTU IT Support frontend.
activation: always
---

# CTU IT Support — Project Context

## Domain
Technical support portal for **Children's Technological University (CTU)** inside **Borg El Arab Technological University (BATU)**. Two user roles: **student** and **admin** (engineer).

## Tech Stack
- **Frontend**: Native HTML5, CSS3, Vanilla JavaScript (ES Modules).
- **Backend**: Django REST Framework at `http://localhost:8000/api` (production TBD).
- **Auth**: JWT tokens (`access` + `refresh`) stored in `localStorage` under key `ctu_token`.
- **Icons**: FontAwesome 6 (local `css/all.min.css` + `webfonts/`).
- **CSS Framework**: Bootstrap 5.3 (local `css/bootstrap.min.css`), supplemented by custom design-system tokens in `css/main.css`.
- **Charts**: Chart.js 4.4 (CDN in information pages).
- **i18n**: Custom `data-i18n` attribute system with EN/AR + RTL toggling.

## Architecture (Target — Modular ES Modules)
```
js/
├── config.js            # API_BASE_URL, TOKEN_KEY, poll intervals
├── api/
│   └── client.js        # fetch wrapper with JWT injection, 401 refresh
├── router/
│   └── auth.js          # role guard, redirect logic
├── components/
│   └── toast.js         # showToast() extracted from app.js
├── views/
│   ├── admin/
│   │   ├── dashboard.js
│   │   ├── students.js
│   │   ├── attendance.js
│   │   └── information.js
│   └── student/
│       ├── dashboard.js
│       ├── profile.js
│       ├── attendance.js
│       └── information.js
└── utils/
    ├── dom.js           # animateCounter, formatDate, etc.
    └── i18n.js          # translated i18n module (ES export)
```

## Roles & Routing
| Role    | Dashboard root         | Sidebar items                                |
|---------|------------------------|----------------------------------------------|
| student | `/student/dashboard.html` | Dashboard, Profile, Attendance, Information |
| admin   | `/admin/dashboard.html`   | Dashboard, Students, Attendance, Information |

Login sets `localStorage['ctu_token']` with `{ access, refresh, role }`. Auth guard reads `role` to decide redirect.

## Key Conventions
- All new JS files use `export` / `import` (ES Modules). HTML `<script type="module">`.
- Legacy global scripts (`app.js`, `i18n.js`, `data.js`) remain loaded via `<script>` until migrated.
- CSS custom properties defined in `:root` and `[data-theme="dark"]` in `main.css`.
- Bilingual data fields use `field` / `fieldAr` pattern (e.g., `name` / `nameAr`).
