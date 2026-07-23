---
description: Full API contract for the Django REST backend that this frontend consumes.
activation:
  - path: "js/api/**"
  - path: "js/views/**"
---

# API Contract — Django REST Backend

Base URL: `http://localhost:8000/api` (configurable in `js/config.js`).

All authenticated endpoints require header: `Authorization: Bearer <access_token>`.

---

## Authentication

### POST `/auth/login/`
**Body:** `{ email, password }`
**Response 200:**
```json
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": {
    "id": 1,
    "name": "Ali Mostafa",
    "name_ar": "علي مصطفى",
    "email": "ali.mostafa@ctu.edu.eg",
    "role": "student",
    "department": "Information Technology",
    "department_ar": "تكنولوجيا المعلومات",
    "year": "3rd Year",
    "year_ar": "السنة الثالثة",
    "phone": "01011111111",
    "academic_id": "CTU-2024-001",
    "image": "https://..."
  }
}
```

### POST `/auth/register/`
**Body:** `{ name, email, password }`
**Response 201:** Same shape as login response.

### POST `/auth/refresh/`
**Body:** `{ refresh }`
**Response 200:** `{ access }`

### POST `/auth/logout/`
**Auth required.** Blacklists the refresh token.

### GET `/auth/me/`
**Auth required.** Returns the current user object.

---

## Reports

### GET `/reports/`
**Auth required.** Returns all reports visible to the user.
- Students see only their own reports.
- Admins see all reports.
**Query params:** `?status=pending|in-progress|done&search=text`

### POST `/reports/`
**Auth required (student).** Submit a new report.
**Body:** `{ location, problem }`

### PATCH `/reports/{id}/`
**Auth required (admin).** Update report status or assignment.
**Body:** `{ status, confirmed_by }`

### DELETE `/reports/{id}/`
**Auth required (admin).**

---

## Students (Admin only)

### GET `/students/`
**Auth required (admin).** Paginated student directory.
**Query params:** `?search=text&department=IT`

### POST `/students/`
**Auth required (admin).** Create a new student.

### PATCH `/students/{id}/`
**Auth required (admin).** Update student info.

### DELETE `/students/{id}/`
**Auth required (admin).**

---

## Attendance

### GET `/attendance/`
**Auth required.** Returns attendance records.
- Students: their own records.
- Admins: all records (filterable by date range).
**Query params:** `?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD`

### POST `/attendance/`
**Auth required (admin).** Start a new attendance day.
**Response:** `{ id, date, is_active: true, students: [] }`

### PATCH `/attendance/{id}/`
**Auth required (admin).** End the day (`is_active: false`) or mark students present.
**Body:** `{ is_active, student_ids: [1, 2, 3] }`

### POST `/attendance/register/`
**Auth required (student).** Student self-registers for the active day.
**Response 200:** `{ message: "Registered" }` or **409** if already registered.

---

## Meetings (New Feature)

### GET `/meetings/`
**Auth required.** Upcoming meetings for the user's role.

### POST `/meetings/`
**Auth required (admin).** Create a meeting.
**Body:** `{ title, title_ar, date, time, location, location_ar, description, description_ar, attendees: ["student"|"admin"|"all"] }`

### PATCH `/meetings/{id}/`
**Auth required (admin).**

### DELETE `/meetings/{id}/`
**Auth required (admin).**

---

## Availability (New Feature)

### GET `/availability/`
**Auth required.** Returns availability entries for the current user (student or admin).

### POST `/availability/`
**Auth required.** Set availability for a date.
**Body:** `{ date: "YYYY-MM-DD", status: "available"|"unavailable"|"partial", note: "..." }`

### PATCH `/availability/{id}/`
**Auth required.** Update an existing availability entry.

### DELETE `/availability/{id}/`
**Auth required.**

---

## Error Responses
All errors follow:
```json
{
  "detail": "Human-readable error message."
}
```
Common codes: `400` (validation), `401` (unauthorized/expired), `403` (forbidden), `404` (not found), `409` (conflict).

## Token Refresh Flow
1. `api/client.js` intercepts any `401` response.
2. Attempts `POST /auth/refresh/` with the stored refresh token.
3. On success: retries the original request with the new access token.
4. On failure (refresh also 401): clears localStorage, redirects to `/login.html`.
