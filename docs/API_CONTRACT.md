# API Contract (Backend Integration Guide)

Currently, the CTU IT Support frontend runs on a mock API layer using `localStorage`. For backend developers taking over this project, you need to implement a REST API that matches the exact inputs and outputs expected by our frontend API adapters (located in `js/api/`).

Once your backend is ready, frontend developers will swap out the mock logic in `js/api/*.js` with standard `fetch()` calls pointing to your server.

---

## Global Requirements

- **Content-Type**: All endpoints should accept and return `application/json`.
- **Authentication**: All endpoints (except Login) must require a Bearer token in the header:
  `Authorization: Bearer <access_token>`

---

## 1. Authentication & Users

### `POST /auth/login/`

**Request:**

```json
{
  "email": "support@ctu.edu.eg",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "1",
    "email": "support@ctu.edu.eg",
    "name": "IT Support User",
    "role": "it_support"
  }
}
```

### `GET /users/` (Admin Only)

**Response (200 OK):**

```json
[
  {
    "id": "1",
    "name": "Lab Sup",
    "email": "lab@ctu.edu.eg",
    "role": "lab_supervisor",
    "status": "active"
  }
]
```

---

## 2. Issues (Tickets)

### `GET /issues/`

- **IT Support & Admin**: Returns ALL issues across the system.
- **Lab Supervisor**: Returns only issues *reported by them*.

**Response (200 OK):**

```json
[
  {
    "id": "iss-1234",
    "title": "Projector not turning on",
    "description": "The bulb seems dead.",
    "room": "Lab 101",
    "priority": "normal",
    "status": "open",
    "reporterId": "2",
    "createdAt": "2026-07-24T10:00:00Z"
  }
]
```

### `POST /issues/`

**Request:**

```json
{
  "title": "Mouse broken",
  "description": "Left click doesn't register",
  "room": "Lab 305",
  "priority": "normal"
}
```

**Response (201 Created):** Returns the created issue object.

### `PATCH /issues/{id}` (IT Support / Admin)

**Request:**

```json
{
  "status": "in_progress"
}
```

---

## 3. Daily Reports (Lab Supervisor)

### `GET /reports/`

**Response (200 OK):**

```json
[
  {
    "id": "rep-456",
    "date": "2026-07-24",
    "status": "All systems operational",
    "notes": "No major issues today.",
    "reporterId": "2"
  }
]
```

### `POST /reports/`

**Request:**

```json
{
  "status": "Minor issues detected",
  "notes": "Some PCs taking long to boot."
}
```

---

## 4. Attendance

### `GET /attendance/`

**Response (200 OK):**

```json
[
  {
    "id": "att-1",
    "userId": "2",
    "userName": "Lab Sup",
    "date": "2026-07-24",
    "timeIn": "08:00 AM",
    "timeOut": "04:00 PM",
    "status": "present"
  }
]
```

### `POST /attendance/register/` (Self check-in)

**Request:** (Empty body, identifies user via Bearer token)

**Response (201 Created):** Returns the new attendance record.
