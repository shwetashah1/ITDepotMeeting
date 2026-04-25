# 🗓️ Support Appointment Scheduling System (Microsoft Bookings Inspired)

A lightweight scheduling system for IT support teams to manage **asset return, swap, and pickup appointments** using a controlled, rule-based booking workflow.

Built as a frontend-first project (HTML, CSS, JavaScript) demonstrating real-world scheduling logic, constraint systems, and product thinking.

---

# 🚀 Project Pitch

Modern IT support teams constantly coordinate physical asset handling (laptops, monitors, peripherals). Existing tools are often:

- Too complex (enterprise tools like ServiceNow)
- Too generic (simple calendar apps)
- Not workflow-aware (no ticket-based scheduling logic)

This project builds a **focused scheduling system** that introduces a structured way to:

> Convert IT support tickets into controlled, rule-based appointment scheduling workflows.

Inspired by systems like **Microsoft Bookings**, but simplified and designed for clarity and learning.

---

# 🧭 The Identity Phase (The "Why")

## 🎯 The Problem We Are Solving

IT support teams struggle with:

- Lack of structured scheduling tied to tickets
- Double bookings and time conflicts
- Manual coordination between support + employees
- No enforcement of working hours, holidays, or rules
- No controlled access to availability (employees see too much or too little)

---

## ❌ Why Existing Tools Don’t Fully Work

| Tool Type | Limitation |
|-----------|-----------|
| Google Calendar | No ticket-based workflow, no rule engine |
| Microsoft Outlook Calendar | Not optimized for structured IT workflows |
| ServiceNow | Too complex for lightweight scheduling needs |
| Manual spreadsheets | No conflict detection, no automation |

---

## 💡 What Makes This System Unique

This system introduces:

### 1. 🧠 Separation of Concerns Architecture
- Default Calendar = source of truth
- Rule Engine = constraints
- Booking Window = controlled access layer
- UI Calendar = computed output only

---

### 2. 🪟 Controlled Booking Windows
Support does NOT open full calendar.

Instead:
> They define a restricted booking window per ticket.

---

### 3. ⚙️ Computed Availability (Not Stored)
Availability is NOT saved.

It is always:

```
Available Slots = Window − (Appointments + Rule Violations)
```


---

### 4. 🔒 Rule-Based Scheduling Engine
- No weekends
- Holiday awareness
- Working hours enforcement
- Conflict detection

---

# 👥 Target Audience

- IT Support Assistants 
- IT Operations Manager
- Employees requesting hardware support
- System administrators managing scheduling workflows

---

# 👤 User Personas

## 🧑‍💼 Support Assistant (Primary User)

**Goal:**
- Convert IT tickets into structured appointments

**Pain Points:**
- Manual coordination with employees
- Conflicting schedules
- Lack of visibility into availability constraints

---

## 👨‍💻 Employee (Secondary User)

**Goal:**
- Book an appointment for asset handling within allowed constraints

**Pain Points:**
- Unclear availability
- Back-and-forth scheduling emails
- No structured booking flow
- Follow-up

---

## 🧑‍🔧 System Admin (Optional Expansion Role)

**Goal:**
- Ensure scheduling rules and system integrity

---

### 👤 User Stories

**Core User Story**
> As an IT support assistant, I want to schedule and manage appointments for asset return, swap, and pickup so that I can efficiently coordinate with employees and track IT assets.

**Supporting User Stories**

- **Appointment Creation**  
  > As a support assistant, I want to create an appointment after receiving a ticket so that I can confirm a time with an employee.

- **Notification**  
  > As a support assistant, I want to notify an employee and their supervisor so that everyone is informed about the appointment.

- **Update Appointment**  
  > As a support assistant, I want to update an appointment so that I can handle scheduling changes.

- **Cancellation**  
  > As an employee or supervisor, I want to cancel an appointment so that I can reschedule if needed.

- **Visibility**  
  > As a support assistant, I want to view all appointments so that I can manage workload and avoid conflicts.

---

# 📦 Data Schema

## 🧾 Appointment (Source of Truth)

```json
{
  "id": "string",
  "employee": {
    "name": "string",
    "email": "string",
  },
  "supervisor": {
    "name": "string",
    "email": "string",
  },
  "appointmentType": "Return | Swap | Pickup",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "status": "Scheduled | Confirmed | Resolved | Cancelled",
  "notes": [
  {
    "note": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

