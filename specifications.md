# 🛠️ System Specifications & Logic Engine

This document outlines the underlying business logic, architectural constraints, and strategic differentiation for the Support Appointment Scheduling System.

---

## 💡 Strategic Differentiation
While generic calendar tools exist, this system is designed specifically for IT hardware lifecycles.

| Tool Type | Limitation vs. This System |
|-----------|-----------|
| **Google/Outlook** | No ticket-based workflow or hardware-specific rule engine. |
| **ServiceNow** | Overly complex; requires heavy configuration for simple scheduling. |
| **Manual Sheets** | Zero conflict detection or automated enforcement of working hours. |

---

## 🧠 Technical Architecture: Separation of Concerns
The application logic is structured into four distinct layers to ensure data integrity:

1. **Source of Truth:** The default calendar and appointment array.
2. **Rule Engine:** The "gatekeeper" containing logic for constraints (holidays, hours).
3. **Booking Window:** A restricted access layer that prevents employees from seeing the entire calendar.
4. **Computed UI:** The final calendar view, which is never stored but always calculated on the fly.

---

## ⚙️ The Scheduling Rule Engine
The system enforces the following hard constraints to prevent scheduling errors:

* **Temporal Limits:** No appointments allowed on weekends or public holidays.
* **Enforced Hours:** Appointments can only be booked within defined "IT Support Hours."
* **Conflict Detection:** New appointments are validated against existing records to prevent double-booking.
* **Restricted Windows:** Support staff define a specific "Booking Window" per ticket, limiting the time range an employee can choose from.

---

## 🧮 Availability Formula
Availability is not a static state; it is a computed result of the following equation:

$$Available Slots = Window − (Existing Appointments + Rule Violations)$$

---

## 📦 Enhanced Data Schema (Audit-Ready)
To support troubleshooting and history, the appointment object utilizes a nested `notes` array for an audit trail rather than a single string.

```json
{
  "id": "string",
  "employee": {
    "name": "string",
    "email": "string"
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