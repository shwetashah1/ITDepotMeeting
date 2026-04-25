# IT Asset Scheduler

## 🗓️ Support Appointment Scheduling System

A dynamic, single-page web application that helps IT support teams manage **asset return, swap, and pickup appointments** through a structured scheduling interface.

Built with **HTML5, CSS3, and vanilla JavaScript** — no frameworks, no build tools.

---

## 🚀 Project Pitch

IT support teams often coordinate hardware-related requests manually, leading to scheduling conflicts and inefficiencies. This project provides a **lightweight scheduling interface** that allows support staff to create, manage, and track appointments while enforcing business rules like working-hours-only scheduling, weekend blocking, and conflict detection.

---

## 👤 User Persona

### 🧑‍💼 Support Assistant (Primary User)

**Goal:** Efficiently schedule and manage IT asset-related appointments.

**Pain Points:**
- Manual scheduling and coordination
- Conflicting time slots
- Lack of structured workflow

### Target Audience

**Primary Users**
- IT Support Assistants
- IT Operations managers managing asset lifecycle

**Secondary Users**
- Employees requesting asset return, swap, or pickup
- Supervisors who need visibility into scheduled appointments

**Context of Use**
- Internal IT support workflows
- Organizations handling frequent hardware movement (laptops, monitors, peripherals)

---

## 🎯 Problem

There is no simple, lightweight interface for managing IT support appointments with clear visibility and control over scheduling. This leads to:

- Double bookings
- Poor coordination
- Time wasted on back-and-forth communication

---

## ✨ Features

- **Two-view architecture** (Home Dashboard, Appointments)
- **Home Dashboard** with appointment statistics — counts by type, by status, and recent activity
- **Appointment Gallery** with card-based layout and real-time search/filtering
- **Full CRUD operations** — Create, Edit, Cancel, and Mark Resolved
- **Scheduling Rule Engine** — weekend blocking, working-hours enforcement, conflict detection
- **Live Widget** using Fetch API (e.g., motivational quote)
- **Client-side form validation** with custom error messaging
- **Simulated notifications** (toast-style UI messages)
- **Responsive design** — mobile, tablet, and desktop layouts
- **Consistent design system** using CSS variables

---

## 🛠️ Technical Implementation

- Built with **HTML5, CSS3, vanilla JavaScript** — zero dependencies
- Uses **Flexbox and CSS Grid** for responsive layout
- **Single-page architecture** — JavaScript toggles view visibility
- Data loaded from **JSON file via Fetch API** on first visit
- Runtime persistence via **localStorage**
- **Modular JS architecture** — separate files for app logic, data, storage, and rules
- CSS variables for consistent spacing, color palette, and typography

---

## 🧩 Application Views

### Home View (Dashboard)
- Appointment summary statistics (by type, by status)
- At-a-glance counts for Scheduled, Confirmed, Resolved, Cancelled
- Breakdown by appointment type (Return, Swap, Pickup)
- Live widget section (fetched from public API)

### Appointments View
- Card-based appointment gallery (minimum 6 seed items)
- Search bar and filter dropdown for real-time filtering
- Create Appointment form with inline validation
- Edit mode (reuses form, pre-filled fields)
- Action buttons per card: Edit, Cancel, Mark Resolved

---

## ⚙️ Scheduling Rule Engine

The system enforces business constraints to prevent scheduling errors:

- **No Weekends:** Appointments cannot be booked on Saturday or Sunday
- **Enforced Hours:** Appointments restricted to IT support hours (9:00–17:00)
- **Conflict Detection:** New/edited appointments validated against existing records
- **Date Validation:** No past-date scheduling allowed

### Availability Formula

$$Available Slots = Working Hours − (Existing Appointments + Rule Violations)$$

---

## 🧱 Data Schema

### Appointment

```json
{
  "id": "number",
  "employeeName": "string",
  "employeeEmail": "string",
  "supervisorName": "string",
  "supervisorEmail": "string",
  "appointmentType": "Return | Swap | Pickup",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "status": "Scheduled | Confirmed | Resolved | Cancelled",
  "notes": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 📁 Project Structure

```
ITAssetScheduler/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js          # Main app logic, view switching, initialization
│       ├── ui.js            # DOM rendering, form handling, notifications
│       ├── storage.js       # localStorage read/write, data loading
│       ├── rules.js         # Scheduling rule engine
│       └── data/
│           └── appointments.json  # Seed data (loaded via Fetch API)
├── docs/
│   ├── instructions.md
│   ├── wireframe.md
│   └── implementation_plan.md
├── specifications.md
└── README_old.md
```

---

## 👤 User Stories

**Core User Story**
> As an IT support assistant, I want to schedule and manage appointments for asset return, swap, and pickup so that I can efficiently coordinate with employees and track IT assets.

**Supporting User Stories**

- **Appointment Creation**
  > As a support assistant, I want to create an appointment so that I can confirm a time with an employee.

- **Appointment Editing**
  > As a support assistant, I want to update an appointment so that I can handle scheduling changes.

- **Cancellation**
  > As a support assistant, I want to cancel an appointment so that it is removed from active scheduling.

- **Resolution**
  > As a support assistant, I want to mark an appointment as resolved so that completed work is tracked.

- **Dashboard Visibility**
  > As a support assistant, I want to see appointment statistics at a glance so that I can manage workload and avoid conflicts.

- **Search & Filter**
  > As a support assistant, I want to search and filter appointments so that I can quickly find specific records.

---

## 📱 Responsive Design

- Mobile-first design approach
- Layout adapts across screen sizes:
  - 1 column (mobile)
  - 2 columns (tablet)
  - 3+ columns (desktop)
- Appointment gallery restructures between mobile and desktop

---

## ⚠️ Challenges & Solutions

### Challenge:
Implementing dynamic filtering and a scheduling rule engine without reloading the page.

### Solution:
Used modular JavaScript to separate concerns — the rule engine validates constraints independently of the UI, and filtering re-renders the gallery from the in-memory dataset, ensuring a smooth and responsive experience.

---

## 🔔 Notification System (Simulated)

User actions trigger inline toast notifications:
- ✅ Appointment created successfully
- 📧 Email notification sent to employee & supervisor (simulated)
- ✏️ Appointment updated
- ❌ Appointment cancelled
- ✔️ Appointment resolved

---

## 🚀 Future Improvements

- Calendar view for appointments
- Booking window per ticket (restricted time ranges)
- Role-based views (Support vs. Employee)
- Backend integration (API + database)
- Real email notifications

---

## 🌐 Deployment

- **GitHub Repository:** [Add Link]
- **Live Deployment:** [Add Link]

---

## 📌 Notes

- Low-fidelity wireframe included in `docs/wireframe.md`
- System specifications documented in `specifications.md`
- Git history follows atomic commit structure (10+ commits)
