# Frontend Development Guide

Welcome to the CTU Support Hub frontend documentation. 

This document explains the structural logic, styling conventions, and UI components used in this Static HTML/CSS template. It is intended for developers who wish to modify the appearance, layout, or components of the application.

## 🏛️ Architecture Overview

This project is a **Multi-Page Application (MPA)**. There is no Javascript-based routing. Every distinct view (e.g., Admin Dashboard, Lab Supervisor Profile, Login Page) has its own dedicated `.html` file.

The primary goal of this architecture is to be **Backend-Agnostic and PHP-Ready**. You do not need Node.js, Webpack, or a complex build process to edit this frontend.

### Directory Structure
- **`/admin`**: Dashboard views exclusively for Administrators.
- **`/staff`**: Dashboard views for Lab Supervisors and IT Support Engineers.
- **`/student`**: Dashboard views for Students.
- **`/css`**: Global stylesheets and component-specific styling.
- **`/js`**: Purely presentation-layer Javascript (e.g., sidebar toggling, theme switching). No business logic resides here.
- **`/components`**: Extracted HTML blocks (like the Sidebar) that you should use as a reference when creating server-side templates (e.g., `include 'sidebar.php';`).

---

## 🎨 CSS Architecture & Theming

We do not use Tailwind or a heavy CSS framework. We use **Vanilla CSS** with a custom CSS Variable (`--var`) design system, alongside a minimal subset of Bootstrap 5.3 (mainly for its grid system and basic utility classes).

### CSS Files breakdown (`/css/`)
1. **`main.css`**: The core stylesheet. It defines the CSS variables for colors, typography, spacing, and the dark/light mode (`data-theme="dark"`) color overrides. It also contains global resets and typography settings.
2. **`components.css`**: Styles for reusable UI elements like Buttons (`.btn`), Forms (`.form-input`), Badges, Cards, and Modals.
3. **`dashboard.css`**: Layout rules specifically for the internal dashboard screens (Sidebar, Topbar, Main Content grid).
4. **`staff.css` / `admin.css`**: Specific overrides or custom components unique to those dashboard roles (e.g., the Kanban board styling or specific data tables).
5. **`animations.css`**: Keyframe animations (e.g., `.fade-in`, `.slide-up`) for smooth UI transitions.

### Dark & Light Mode
Theme switching is purely CSS-driven via variables. 
The `:root` selector in `main.css` defines the light theme colors.
The `[data-theme="dark"]` selector overwrites those exact variables with dark theme equivalents.

```css
/* Example from main.css */
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
}

[data-theme="dark"] {
  --bg-primary: #111827;
  --text-primary: #f9fafb;
}
```
Javascript in `app.js` simply toggles the `data-theme` attribute on the `<html>` tag and saves the preference to `localStorage`.

### Localization (LTR / RTL)
The application supports seamless translation between English (Left-to-Right) and Arabic (Right-to-Left).
- The `<html>` tag requires a `dir="ltr"` or `dir="rtl"` attribute.
- CSS layout relies heavily on CSS Logical Properties (e.g., `margin-inline-start`, `padding-inline-end`) rather than absolute directions (`margin-left`). This ensures the layout automatically flips when the `dir` attribute is changed to RTL!

---

## 🧩 UI Components

When modifying HTML, rely on these standardized classes:

### Buttons
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary Action</button>
<button class="btn btn-danger">Destructive Action</button>
<!-- Add 'btn-sm' or 'btn-lg' for sizing -->
```

### Forms
```html
<div class="form-group">
  <label class="form-label">Username</label>
  <input type="text" class="form-input" placeholder="Enter username">
</div>
```

### Badges (Status Indicators)
```html
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Closed</span>
```

### Modals
Modals are pure HTML/CSS. They are hidden by default and shown by adding the `.active` class to the `.modal-overlay`.
```html
<div class="modal-overlay" id="my-modal">
  <div class="modal">
    <h3>Modal Title</h3>
    <p>Modal content goes here.</p>
    <button onclick="document.getElementById('my-modal').classList.remove('active')">Close</button>
  </div>
</div>
```

---

## 📱 Mobile Responsiveness

The design is mobile-first. 
1. Use Bootstrap's grid system (e.g., `col-12 col-md-6`) for structural layout.
2. The Sidebar automatically collapses into a hamburger menu on screens smaller than `768px`.
3. **Important:** Ensure all clickable targets (buttons, links, form inputs) maintain a minimum height of `44px` to comply with touch-target accessibility standards.
