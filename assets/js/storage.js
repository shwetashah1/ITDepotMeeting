/* ============================================================
   Storage Module
   Handles data loading (JSON via Fetch) and localStorage persistence.
   ============================================================ */

const Storage = {
  KEY: 'itasset_appointments',
  DATA_URL: 'assets/js/data/appointments.json',

  /**
   * Load appointments: localStorage first, then seed JSON as fallback.
   * @returns {Promise<Array>} Array of appointment objects.
   */
  async loadAppointments() {
    const stored = localStorage.getItem(this.KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // First visit — fetch seed data
    try {
      const response = await fetch(this.DATA_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.saveAppointments(data);
      return data;
    } catch (err) {
      console.error('Failed to load seed data:', err);
      return [];
    }
  },

  /**
   * Persist the full appointments array to localStorage.
   * @param {Array} appointments
   */
  saveAppointments(appointments) {
    localStorage.setItem(this.KEY, JSON.stringify(appointments));
  },

  /**
   * Generate the next sequential ID.
   * @param {Array} appointments
   * @returns {number}
   */
  getNextId(appointments) {
    if (appointments.length === 0) return 1;
    return Math.max(...appointments.map(a => a.id)) + 1;
  }
};
