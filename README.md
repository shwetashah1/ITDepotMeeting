# IT Asset Scheduler

# 🗓️ Support Appointment Scheduling System

A dynamic web application that helps IT support teams manage **asset return, swap, and pickup appointments** through a structured and user-friendly scheduling interface.

Built using **HTML5, CSS3, and Advanced JavaScript**, this project demonstrates real-world frontend architecture, dynamic rendering, and interactive UI design.

---

# 🚀 Project Pitch

IT support teams often coordinate hardware-related requests manually, leading to scheduling conflicts and inefficiencies.

This project provides a **simplified scheduling interface** that allows support staff to manage appointments and employees to view availability in a structured way.

---

# 👤 User Persona

## 🧑‍💼 Support Assistant (Primary User)

**Goal:**  
Efficiently schedule and manage IT asset-related appointments.

**Pain Points:**

- Manual scheduling and coordination
- Conflicting time slots
- Lack of structured workflow

---

# 🎯 Problem

There is no simple, lightweight interface for managing IT support appointments with clear visibility and control over scheduling.

This leads to:

- Double bookings
- Poor coordination
- Time wasted on back-and-forth communication

---

# ✨ Features

- Multi-view interface (Home, Schedule, Contact)
- Dynamic data gallery displaying appointment-related data
- Real-time search and filtering of data
- Live widget using Fetch API (e.g., quote or time)
- Client-side form validation with custom error handling
- Responsive layout for mobile and desktop
- Consistent UI design using CSS variables

---

# 🛠️ Technical Implementation

- Built with **HTML5, CSS3, Advanced JavaScript**
- Uses **Flexbox and CSS Grid** for layout
- Implements **multi-view architecture** using JavaScript to toggle sections
- Dynamic rendering of data using JavaScript arrays
- Event-driven interactions for filtering and form handling
- Fetch API used to retrieve live data from a public API
- CSS variables used for consistent spacing and color system

---

# 🧩 Application Structure

## Views:

- **Home View** → Overview and navigation
- **Schedule View** → Data gallery and filtering
- **Contact View** → Form with validation

---

# 📊 Data Gallery

- Built using a local JavaScript array (minimum 6 items)
- Data rendered dynamically as cards
- Users can filter/search results in real-time

---

# 🔄 Live Widget

- Integrated using the **Fetch API**
- Displays real-time data (e.g., motivational quote)
- Updates asynchronously without page reload

---

# 🧾 Form Validation

- Custom JavaScript validation implemented
- Provides user-friendly error messages
- Does not rely solely on HTML5 required attributes

---

# 📱 Responsive Design

- Mobile-first design approach
- Layout adapts across screen sizes:
  - 1 column (mobile)
  - 2 columns (tablet)
  - 3+ columns (desktop)
- Gallery component changes structure between mobile and desktop

---

# ⚠️ Challenges & Solutions

## Challenge:

Implementing dynamic filtering without reloading the page.

## Solution:

Used JavaScript to filter the dataset and re-render the UI based on user input, ensuring a smooth and responsive user experience.

---

# 📁 Project Setup

```
ITAssetScheduler/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── script.js
│       ├── storage.js
│       └── data.json
├── docs/
│   ├── UI.md
```

---

# 🌐 Live Demo

- **GitHub Repository:** [Add Link]
- **Live Deployment:** [Add Link]

---

# 📌 Notes

- Low-fidelity wireframe included in repository
- Research and API references documented in `NOTES.md`
- Git history follows atomic commit structure (10+ commits)

### 🎯 Target Audience

**Primary Users**

- IT Support Assistants
- IT Operations manager managing asset lifecycle

**Secondary Users**

- Employees requesting asset return, swap, or pickup
- Supervisors who need visibility into Employees scheduled appointments

**Context of Use**

- Internal IT support workflows
- Organizations handling frequent hardware movement (laptops, monitors, peripherals)

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

### 🧱 Data Schema

#### Basic Appointment Structure

```json
{
  "id": "number",
  "employeeId": "number",
  "typeId": "number",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "status": "number",
  "notes": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Appointment Type: "Return | Swap | Pickup",

```json
{
  "id": "number",
  "name": "string",
  "createdAt":"timestamp",
  "updatedAt":"timestamp",
  "deletedAt":"timestamp"
}
```

### Appointment Status: "Scheduled | Confirmed | Resolved | Cancelled",

```json
{
  "id": "number",
  "name": "string",
  "createdAt":"timestamp",
  "updatedAt":"timestamp",
  "deletedAt":"timestamp"
}
```

#### Basic Employee Structure

```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "reportingId": "number",
  "status": "number",
  "createdAt":"timestamp",
  "updatedAt":"timestamp",
}
```

### Employee Status: "Active | Inactive",

```json
{
  "id": "number",
  "name": "string",
  "createdAt":"timestamp",
  "updatedAt":"timestamp",
  "deletedAt":"timestamp"
}
```

#### Example Appointment Structure

```json
{
  "id": 1,
  "employee": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "reporting": {
    "name": "John Doe",
    "email": "manager@example.com"
  },
  "appointmentType": "Return",
  "asset": {
    "assetId": "LAP-123",
    "assetType": "Laptop | Monitor | Peripheral"
  },
  "schedule": {
    "date": "2026-04-15",
    "time": "10:30"
  },
  "status": "Scheduled",
  "notes": "",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
