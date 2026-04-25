/* ============================================================
   Rules Module — Scheduling Rule Engine
   Pure validation logic with no DOM dependencies.
   ============================================================ */

const Rules = {
  WORK_START: 9,   // 9:00 AM
  WORK_END:   17,  // 5:00 PM

  /**
   * Reject weekends (Saturday = 6, Sunday = 0).
   * @param {string} dateStr - "YYYY-MM-DD"
   */
  validateNotWeekend(dateStr) {
    const day = new Date(dateStr + 'T00:00:00').getDay();
    return {
      valid: day !== 0 && day !== 6,
      message: 'Appointments cannot be scheduled on weekends.'
    };
  },

  /**
   * Only allow times within support hours.
   * @param {string} timeStr - "HH:MM"
   */
  validateWorkingHours(timeStr) {
    const [hours] = timeStr.split(':').map(Number);
    return {
      valid: hours >= this.WORK_START && hours < this.WORK_END,
      message: `Appointments must be between ${this.WORK_START}:00 and ${this.WORK_END}:00.`
    };
  },

  /**
   * Reject dates in the past.
   * @param {string} dateStr - "YYYY-MM-DD"
   */
  validateNotPastDate(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(dateStr + 'T00:00:00');
    return {
      valid: selected >= today,
      message: 'Cannot schedule appointments in the past.'
    };
  },

  /**
   * Prevent double-booking at the same date + time.
   * @param {string} dateStr
   * @param {string} timeStr
   * @param {Array}  appointments - existing records
   * @param {number|null} excludeId - skip this ID (for edits)
   */
  validateNoConflict(dateStr, timeStr, appointments, excludeId) {
    const conflict = appointments.find(
      a => a.date === dateStr &&
           a.time === timeStr &&
           a.status !== 'Cancelled' &&
           a.id !== excludeId
    );
    return {
      valid: !conflict,
      message: conflict
        ? `Time conflict with ${conflict.employeeName}'s appointment at ${timeStr}.`
        : ''
    };
  },

  /**
   * Validate required form fields and email format.
   * @param {Object} data - form data object
   * @returns {string[]} Array of error messages (empty = valid).
   */
  validateFormFields(data) {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.employeeName.trim())  errors.push('Employee name is required.');
    if (!data.employeeEmail.trim()) errors.push('Employee email is required.');
    else if (!emailRegex.test(data.employeeEmail))
      errors.push('Employee email format is invalid.');

    if (!data.supervisorName.trim())  errors.push('Supervisor name is required.');
    if (!data.supervisorEmail.trim()) errors.push('Supervisor email is required.');
    else if (!emailRegex.test(data.supervisorEmail))
      errors.push('Supervisor email format is invalid.');

    if (!data.appointmentType) errors.push('Appointment type is required.');
    if (!data.date)            errors.push('Date is required.');
    if (!data.time)            errors.push('Time is required.');

    return errors;
  },

  /**
   * Run all validations (field + business rules).
   * @param {Object} appointment - form data
   * @param {Array}  existingAppointments
   * @param {number|null} excludeId
   * @returns {string[]} Array of error messages (empty = valid).
   */
  validateAppointment(appointment, existingAppointments, excludeId = null) {
    // Field validation first
    const fieldErrors = this.validateFormFields(appointment);
    if (fieldErrors.length > 0) return fieldErrors;

    // Business rule validation
    const ruleChecks = [
      this.validateNotWeekend(appointment.date),
      this.validateWorkingHours(appointment.time),
      this.validateNotPastDate(appointment.date),
      this.validateNoConflict(appointment.date, appointment.time, existingAppointments, excludeId)
    ];

    return ruleChecks
      .filter(result => !result.valid)
      .map(result => result.message);
  }
};
