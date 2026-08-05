# Backend Integration Guide (PHP Ready)

Welcome to the CTU Support Hub integration guide.

This frontend has been specifically designed to be easily sliced and integrated into a server-side rendering framework, primarily **PHP**. There is no complex Javascript framework, API routing, or `fetch()` endpoints to worry about.

This guide explains how to hook up the static HTML templates to your database and authentication system.

---

## 1. File & Folder Structure
The static `.html` files are organized by user role:
- `/admin/*` - Requires Administrator session logic.
- `/staff/*` - Requires Lab Supervisor or IT Support session logic.
- `/student/*` - Requires Student session logic.

### 🐘 PHP Implementation Hint:
You should rename all `.html` files to `.php` files (e.g., `admin/overview.php`).
At the very top of every PHP file in these folders, you must implement Session checks.

```php
<?php
session_start();
// Example pseudo-code for an Admin page
if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    header("Location: ../login.php");
    exit();
}
?>
```

---

## 2. Templating & Includes
Currently, the HTML structure (Navbar, Sidebar, Footer) is duplicated across every file so the templates can be previewed statically. 

### 🐘 PHP Implementation Hint:
You should extract the `<aside class="sidebar">` and `<header class="dashboard-topbar">` sections into reusable PHP includes to avoid duplication.
- Create `includes/header.php`
- Create `includes/sidebar.php`
- Create `includes/footer.php`

Then, in your main view files (e.g. `staff/overview.php`), use:
```php
<?php include '../includes/sidebar.php'; ?>
```

*(Note: We have provided a reference `components/sidebar.html` that you can use as your base include file).*

---

## 3. Form Submissions
All forms in this template use standard HTML form attributes. There is no `event.preventDefault()` Javascript blocking your forms.

### 🐘 PHP Implementation Hint:
To make a form work:
1. Ensure the `<form>` tag has `method="POST"`.
2. Ensure the `<form>` tag has an `action="your-processing-script.php"`.
3. Add `name="..."` attributes to every `<input>`, `<select>`, and `<textarea>`. The template currently omits `name` attributes since it was static.

**Example (Modifying `login.html` to `login.php`):**
```html
<form id="login-form" method="POST" action="process_login.php">
  <div class="form-group">
    <label class="form-label">Email</label>
    <input type="email" name="email" class="form-input" required>
  </div>
  <!-- ... -->
  <button type="submit">Sign In</button>
</form>
```

---

## 4. Displaying Success Messages (Modals)
In several files (like `report.html`), there is a hidden Success Modal.

### 🐘 PHP Implementation Hint:
The frontend Javascript (`js/app.js`) is programmed to automatically show the success modal if it detects `?success=1` in the URL.

When your PHP script successfully processes a form (e.g., inserting a report into the database), you should redirect the user back to the page with that parameter:
```php
<?php
// ... database insert logic ...
header("Location: report.php?success=1");
exit();
?>
```

---

## 5. Dynamic Data Loops
Whenever you see a grid of cards or a table (e.g.,| URL Path | Action | Description |
|---|---|---|
| `login.html` | `POST /api/auth/login` | Authenticate user and return JWT + Role |
| `support/support-issues.html` | `POST /api/issues/:id/status` | Update the status of a specific issue |
| `lab-supervisor/lab-supervisor-reports.html` | `POST /api/reports/submit` | Submit a daily lab operation report |e the duplicate static rows and wrap a single HTML row/card in a PHP `while` or `foreach` loop fetching data from your MySQL database.

**Example (Admin Issues Table):**
```php
<tbody>
  <?php foreach($issues as $issue): ?>
  <tr>
    <td>#<?php echo $issue['id']; ?></td>
    <td><?php echo htmlspecialchars($issue['title']); ?></td>
    <td><?php echo htmlspecialchars($issue['room']); ?></td>
    <td>
       <!-- Status Select Dropdown -->
       <form method="POST" action="update_status.php">
          <input type="hidden" name="issue_id" value="<?php echo $issue['id']; ?>">
          <select name="status" class="status-select <?php echo strtolower($issue['status']); ?>" onchange="this.form.submit()">
            <option value="new" <?php if($issue['status']=='New') echo 'selected'; ?>>New</option>
            <option value="in_progress" <?php if($issue['status']=='In Progress') echo 'selected'; ?>>In Progress</option>
            <option value="resolved" <?php if($issue['status']=='Resolved') echo 'selected'; ?>>Resolved</option>
          </select>
       </form>
    </td>
  </tr>
  <?php endforeach; ?>
</tbody>
```

Throughout the HTML code, you will find `<!-- [BACKEND HINT] -->` comments guiding you on exactly where to insert these PHP loops!
