/* ============================================================
   App Module — Main Application Controller
   Orchestrates storage, rules, and UI modules.
   ============================================================ */

const App = {
  /** @type {Array} In-memory appointments array */
  appointments: [],

  /** @type {number|null} ID of appointment being edited, null if creating */
  editingId: null,

  /* ==========================================================
     INITIALIZATION
     ========================================================== */

  /** Bootstrap the application on page load. */
  async init() {
    this.appointments = await Storage.loadAppointments();
    this.bindEvents();

    // Check URL params for deep-link into appointments view
    const params = new URLSearchParams(window.location.search);
    if (params.has('status') || params.has('type')) {
      this.applyUrlParams(params);
      this.switchView('appointments');
    } else {
      this.renderCurrentView();
    }

    this.fetchWidget();
  },

  /* ==========================================================
     EVENT BINDING
     ========================================================== */

  /** Attach all event listeners using delegation where appropriate. */
  bindEvents() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchView(btn.dataset.view));
    });

    // Logo link → home
    document.getElementById('logo-link').addEventListener('click', e => {
      e.preventDefault();
      this.switchView('home');
    });

    // Create button
    document.getElementById('btn-create').addEventListener('click', () => {
      this.editingId = null;
      UI.showForm();
    });

    // Form submit
    document.getElementById('appointment-form').addEventListener('submit', e => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Form close / cancel buttons
    document.getElementById('btn-close-form').addEventListener('click', () => UI.hideForm());
    document.getElementById('btn-cancel-form').addEventListener('click', () => UI.hideForm());

    // Search — debounced for performance
    let searchTimer;
    document.getElementById('search-input').addEventListener('input', e => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => this.refreshGallery(), 250);
    });

    // Filter dropdowns
    document.getElementById('filter-status').addEventListener('change', () => this.refreshGallery());
    document.getElementById('filter-type').addEventListener('change', () => this.refreshGallery());

    // Clear all filters
    document.getElementById('btn-clear-filters').addEventListener('click', () => this.clearFilters());

    // Stat card clicks (delegated since cards are rendered dynamically)
    document.getElementById('stats-grid').addEventListener('click', e => {
      const card = e.target.closest('.stat-card-link');
      if (!card) return;
      this.navigateToAppointments(card.dataset.filterKey, card.dataset.filterValue);
    });
  },

  /* ==========================================================
     NAVIGATION
     ========================================================== */

  /**
   * Switch between views and render the target view.
   * @param {string} viewName - "home" or "appointments"
   */
  switchView(viewName) {
    UI.showView(viewName);
    this.renderCurrentView(viewName);

    // Clear URL params when navigating away from appointments
    if (viewName === 'home') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  },

  /**
   * Navigate to the Appointments view with a pre-set filter.
   * Called when a dashboard stat card is clicked.
   * @param {string} filterKey - 'status', 'type', or '' (all)
   * @param {string} filterValue - e.g. 'Scheduled', 'Return', or ''
   */
  navigateToAppointments(filterKey, filterValue) {
    // Reset filters to defaults
    document.getElementById('search-input').value = '';
    document.getElementById('filter-status').value = 'all';
    document.getElementById('filter-type').value = 'all';

    // Apply the specific filter
    if (filterKey === 'status') {
      document.getElementById('filter-status').value = filterValue;
    } else if (filterKey === 'type') {
      document.getElementById('filter-type').value = filterValue;
    }

    // Update URL to reflect the filter
    this.updateUrl(filterKey, filterValue);
    this.switchView('appointments');
  },

  /**
   * Apply URL params to the filter controls.
   * @param {URLSearchParams} params
   */
  applyUrlParams(params) {
    if (params.has('status')) {
      document.getElementById('filter-status').value = params.get('status');
    }
    if (params.has('type')) {
      document.getElementById('filter-type').value = params.get('type');
    }
  },

  /**
   * Update the browser URL with filter params (no page reload).
   * @param {string} filterKey
   * @param {string} filterValue
   */
  updateUrl(filterKey, filterValue) {
    const url = new URL(window.location);
    url.searchParams.delete('status');
    url.searchParams.delete('type');
    if (filterKey && filterValue) {
      url.searchParams.set(filterKey, filterValue);
    }
    window.history.replaceState({}, '', url);
  },

  /**
   * Render the content for the active view.
   * @param {string} [viewName] - defaults to whichever view is active
   */
  renderCurrentView(viewName) {
    const active = viewName || document.querySelector('.nav-btn.active')?.dataset.view || 'home';
    if (active === 'home') {
      UI.renderDashboard(this.appointments);
      UI.renderRecentList(this.appointments);
    } else {
      this.refreshGallery();
    }
  },

  /* ==========================================================
     FILTERING
     ========================================================== */

  /** Reset all search and filter controls to defaults. */
  clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-status').value = 'all';
    document.getElementById('filter-type').value = 'all';
    window.history.replaceState({}, '', window.location.pathname);
    this.refreshGallery();
  },

  /**
   * Apply search + filters and re-render the gallery.
   */
  refreshGallery() {
    const query  = document.getElementById('search-input').value.toLowerCase().trim();
    const status = document.getElementById('filter-status').value;
    const type   = document.getElementById('filter-type').value;

    const filtered = this.appointments.filter(a => {
      const matchesSearch = !query || a.employeeName.toLowerCase().includes(query);
      const matchesStatus = status === 'all' || a.status === status;
      const matchesType   = type === 'all' || a.appointmentType === type;
      return matchesSearch && matchesStatus && matchesType;
    });

    UI.renderGallery(filtered);
  },

  /* ==========================================================
     CRUD OPERATIONS
     ========================================================== */

  /** Handle form submission for both create and edit. */
  handleFormSubmit() {
    const formData = UI.getFormData();
    const errors = Rules.validateAppointment(formData, this.appointments, this.editingId);

    if (errors.length > 0) {
      UI.showFormErrors(errors);
      return;
    }

    if (this.editingId !== null) {
      this.updateAppointment(formData);
    } else {
      this.createAppointment(formData);
    }
  },

  /**
   * Create a new appointment.
   * @param {Object} data - validated form data
   */
  createAppointment(data) {
    const now = new Date().toISOString();
    const appointment = {
      ...data,
      id: Storage.getNextId(this.appointments),
      status: 'Scheduled',
      createdAt: now,
      updatedAt: now
    };

    this.appointments.push(appointment);
    Storage.saveAppointments(this.appointments);

    UI.hideForm();
    this.refreshGallery();
    UI.showToast('Appointment created successfully.', 'success');
    UI.showToast(`📧 Notification sent to ${data.employeeName} and ${data.supervisorName}.`, 'info');
  },

  /**
   * Update an existing appointment.
   * @param {Object} data - validated form data
   */
  updateAppointment(data) {
    const index = this.appointments.findIndex(a => a.id === this.editingId);
    if (index === -1) return;

    this.appointments[index] = {
      ...this.appointments[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    Storage.saveAppointments(this.appointments);
    this.editingId = null;

    UI.hideForm();
    this.refreshGallery();
    UI.showToast('Appointment updated successfully.', 'success');
    UI.showToast(`📧 Notification sent to ${data.employeeName} and ${data.supervisorName}.`, 'info');
  },

  /**
   * Open the form in edit mode for a given appointment.
   * @param {number} id
   */
  startEdit(id) {
    const appointment = this.appointments.find(a => a.id === id);
    if (!appointment) return;
    this.editingId = id;
    UI.showForm(appointment);
  },

  /**
   * Set appointment status to Confirmed.
   * @param {number} id
   */
  confirmAppointment(id) {
    this.updateStatus(id, 'Confirmed', '✔ Appointment confirmed.');
  },

  /**
   * Set appointment status to Cancelled.
   * @param {number} id
   */
  cancelAppointment(id) {
    this.updateStatus(id, 'Cancelled', '✖ Appointment cancelled.');
  },

  /**
   * Set appointment status to Resolved.
   * @param {number} id
   */
  resolveAppointment(id) {
    this.updateStatus(id, 'Resolved', '✔ Appointment resolved.');
  },

  /**
   * Generic status update helper.
   * @param {number} id
   * @param {string} newStatus
   * @param {string} toastMessage
   */
  updateStatus(id, newStatus, toastMessage) {
    const appointment = this.appointments.find(a => a.id === id);
    if (!appointment) return;

    appointment.status = newStatus;
    appointment.updatedAt = new Date().toISOString();

    Storage.saveAppointments(this.appointments);
    this.refreshGallery();
    UI.showToast(toastMessage, newStatus === 'Cancelled' ? 'error' : 'success');
  },

  /* ==========================================================
     LIVE WIDGET
     ========================================================== */

  /** Fetch a random quote from a public API and render it. */
  async fetchWidget() {
    try {
      const response = await fetch('https://dummyjson.com/quotes/random');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      UI.renderWidget({ quote: data.quote, author: data.author });
    } catch (err) {
      console.warn('Widget API unavailable, using fallback:', err.message);
      // Fallback: display a static quote
      UI.renderWidget({
        quote: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs'
      });
    }
  }
};

/* ---------- Bootstrap ---------- */
document.addEventListener('DOMContentLoaded', () => App.init());
