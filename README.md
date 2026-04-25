# IT Asset Scheduler

## 🧭 The Identity Phase (The "Why")

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
  "id": "string",
  "employee": {
    "name": "string",
    "email": "string",
  },
  "supervisor": {
    "name": "string",
    "email": "string",
  },
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

#### Example Appointment Structure

```json
{
  "id": "APT-001",
  "employee": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "supervisor": {
    "name": "John Doe",
    "email": "manager@example.com",
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
