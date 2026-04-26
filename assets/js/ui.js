/* ============================================================
   UI Module
   Handles all DOM rendering and manipulation.
   ============================================================ */

const UI = {

  /* ---------- DOM References ---------- */
  elements: {
    statsGrid:      () => document.querySelector('#stats-grid'),
    liveWidget:     () => document.querySelector('#live-widget'),
    recentList:     () => document.querySelector('#recent-list'),
    gallery:        () => document.querySelector('#gallery'),
    formContainer:  () => document.querySelector('#form-container'),
    formTitle:      () => document.querySelector('#form-title'),
    form:           () => document.querySelector('#appointment-form'),
    formErrors:     () => document.querySelector('#form-errors'),
    submitBtn:      () => document.querySelector('#btn-submit'),
    searchInput:    () => document.querySelector('#search-input'),
    filterStatus:   () => document.querySelector('#filter-status'),
    filterType:     () => document.querySelector('#filter-type'),
    toastContainer: () => document.querySelector('#toast-container')
  },

  /* ==========================================================
     DASHBOARD
     ========================================================== */

  /**
   * Render the dashboard stats grid.
   * @param {Array} appointments
   */
  renderDashboard(appointments) {
    const container = this.elements.statsGrid();

    // Count by status
    const byStatus = { Scheduled: 0, Confirmed: 0, Resolved: 0, Cancelled: 0 };
    // Count by type
    const byType = { Return: 0, Swap: 0, Pickup: 0 };

    appointments.forEach(a => {
      if (byStatus[a.status] !== undefined) byStatus[a.status]++;
      if (byType[a.appointmentType] !== undefined) byType[a.appointmentType]++;
    });

    // Each stat links to the Appointments view with a pre-set filter
    const stats = [
      { label: 'Total',     value: appointments.length, filterKey: '',       filterValue: '' },
      { label: 'Scheduled', value: byStatus.Scheduled,  filterKey: 'status', filterValue: 'Scheduled' },
      { label: 'Confirmed', value: byStatus.Confirmed,  filterKey: 'status', filterValue: 'Confirmed' },
      { label: 'Resolved',  value: byStatus.Resolved,   filterKey: 'status', filterValue: 'Resolved' },
      { label: 'Cancelled', value: byStatus.Cancelled,  filterKey: 'status', filterValue: 'Cancelled' },
      { label: 'Returns',   value: byType.Return,       filterKey: 'type', filterValue: 'Return' },
      { label: 'Swaps',     value: byType.Swap,         filterKey: 'type', filterValue: 'Swap' },
      { label: 'Pickups',   value: byType.Pickup,       filterKey: 'type', filterValue: 'Pickup' }
    ];

    container.innerHTML = stats.map(s => `
      <div class="stat-card stat-card-link"
           data-filter-key="${s.filterKey}"
           data-filter-value="${s.filterValue}"
           role="link" tabindex="0"
           title="View ${s.label} appointments">
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');
  },

  /**
   * Render the recent appointments list (last 5 by createdAt).
   * @param {Array} appointments
   */
  renderRecentList(appointments) {
    const container = this.elements.recentList();
    const sorted = [...appointments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const heading = `
      <div class="card-header">
        <h4>🕐 Recent Appointments</h4>
      </div>
    `;

    if (sorted.length === 0) {
      container.innerHTML = heading + '<div class="card-body"><p class="empty-state">No appointments yet.</p></div>';
      return;
    }

    const items = sorted.map(a => `
      <div class="recent-item">
        <span class="recent-item-name">${this.escapeHtml(a.employeeName)}</span>
        <span class="recent-item-meta">
          <span class="badge badge-${a.status.toLowerCase()}">${a.status}</span>
          ${a.date}
        </span>
      </div>
    `).join('');

    container.innerHTML = heading + `<div class="card-body">${items}</div>`;
  },

  /* ==========================================================
     LIVE WIDGET
     ========================================================== */

  /**
   * Render fetched quote data in the widget.
   * @param {{ quote: string, author: string }} data
   */
  renderWidget(data) {
    const container = this.elements.liveWidget();
    container.innerHTML = `
      <div class="card-header">
        <h4>💡 Quote of the Day</h4>
      </div>
      <div class="card-body">
        <p class="widget-quote">"${this.escapeHtml(data.quote)}"</p>
        <p class="widget-author">— ${this.escapeHtml(data.author)}</p>
      </div>
    `;
  },

  /**
   * Show error fallback in widget.
   * @param {string} message
   */
  renderWidgetError(message) {
    const container = this.elements.liveWidget();
    container.innerHTML = `
      <div class="card-header">
        <h4>💡 Quote of the Day</h4>
      </div>
      <div class="card-body">
        <p class="widget-loading">${message}</p>
      </div>
    `;
  },

  /* ==========================================================
     APPOINTMENT GALLERY
     ========================================================== */

  /**
   * Render the appointment cards gallery.
   * @param {Array} appointments
   */
  renderGallery(appointments) {
    const container = this.elements.gallery();

    if (appointments.length === 0) {
      container.innerHTML = '<p class="empty-state">No appointments match your criteria.</p>';
      return;
    }

    container.innerHTML = appointments.map(a => this.buildCard(a)).join('');
  },

  /**
   * Build a single appointment card's HTML.
   * @param {Object} a - appointment object
   * @returns {string} HTML string
   */
  buildCard(a) {
    const statusClass = `badge-${a.status.toLowerCase()}`;
    const typeClass   = `badge-${a.appointmentType.toLowerCase()}`;
    const actions     = this.getCardActions(a);

    return `
      <article class="card" data-id="${a.id}">
        <div class="card-header">
          <div class="card-title-group">
            <h4 class="status-${a.status.toLowerCase()}">${a.status}</h4>
            <div class="card-subtitle">${this.escapeHtml(a.employeeName)}</div>
          </div>
          <div class="card-header-right">
            ${actions ? `<div class="card-actions-top">${actions}</div>` : ''}
            <span class="badge ${typeClass}">${a.appointmentType}</span>
          </div>
        </div>
        <div class="card-body">
          <span>📧 ${this.escapeHtml(a.employeeEmail)}</span>
          <span>👤 Supervisor: ${this.escapeHtml(a.supervisorName)}</span>
          <span>📅 ${a.date} at ${a.time}</span>
          ${a.notes ? `<span>📝 ${this.escapeHtml(a.notes)}</span>` : ''}
        </div>
      </article>
    `;
  },

  /**
   * Determine which action buttons to show based on status.
   * Status transitions:
   *   Scheduled → Confirm, Edit, Cancel
   *   Confirmed → Edit, Cancel, Resolve
   *   Resolved / Cancelled → no actions
   */
  getCardActions(a) {
    const id = a.id;
    switch (a.status) {
      case 'Scheduled':
        return `
          <button class="btn-icon has-tooltip" onclick="App.startEdit(${id})" data-title="Edit">✏️</button>
          <button class="btn-icon has-tooltip" onclick="App.confirmAppointment(${id})" data-title="Confirm">✔</button>
          <button class="btn-icon has-tooltip" onclick="App.cancelAppointment(${id})" data-title="Cancel">✖</button>
        `;
      case 'Confirmed':
        return `
          <button class="btn-icon has-tooltip" onclick="App.startEdit(${id})" data-title="Edit">✏️</button>
          <button class="btn-icon has-tooltip" onclick="App.resolveAppointment(${id})" data-title="Resolve">✔</button>
          <button class="btn-icon has-tooltip" onclick="App.cancelAppointment(${id})" data-title="Cancel">✖</button>
        `;
      default:
        return ''; // Resolved and Cancelled are final states
    }
  },

  /* ==========================================================
     FORM HELPERS
     ========================================================== */

  /**
   * Show the form in create or edit mode.
   * @param {Object|null} appointment - if provided, pre-fills fields (edit mode)
   */
  showForm(appointment = null) {
    const container = this.elements.formContainer();
    const title     = this.elements.formTitle();
    const submitBtn = this.elements.submitBtn();

    container.classList.remove('hidden');
    this.clearFormErrors();

    if (appointment) {
      // Edit mode
      title.textContent = 'Edit Appointment';
      submitBtn.textContent = 'Update Appointment';
      document.querySelector('#emp-name').value   = appointment.employeeName;
      document.querySelector('#emp-email').value   = appointment.employeeEmail;
      document.querySelector('#sup-name').value    = appointment.supervisorName;
      document.querySelector('#sup-email').value   = appointment.supervisorEmail;
      document.querySelector('#appt-type').value   = appointment.appointmentType;
      document.querySelector('#appt-date').value   = appointment.date;
      document.querySelector('#appt-time').value   = appointment.time;
      document.querySelector('#appt-notes').value  = appointment.notes || '';
    } else {
      // Create mode
      title.textContent = 'Create Appointment';
      submitBtn.textContent = 'Create Appointment';
      this.elements.form().reset();
    }

    // Scroll form into view
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  /** Hide the form and reset state. */
  hideForm() {
    this.elements.formContainer().classList.add('hidden');
    this.elements.form().reset();
    this.clearFormErrors();
  },

  /**
   * Read current form values into a data object.
   * @returns {Object} form data
   */
  getFormData() {
    return {
      employeeName:    document.querySelector('#emp-name').value,
      employeeEmail:   document.querySelector('#emp-email').value,
      supervisorName:  document.querySelector('#sup-name').value,
      supervisorEmail: document.querySelector('#sup-email').value,
      appointmentType: document.querySelector('#appt-type').value,
      date:            document.querySelector('#appt-date').value,
      time:            document.querySelector('#appt-time').value,
      notes:           document.querySelector('#appt-notes').value
    };
  },

  /**
   * Display validation errors below the form.
   * @param {string[]} errors
   */
  showFormErrors(errors) {
    const container = this.elements.formErrors();
    container.innerHTML = errors
      .map(e => `<div class="form-error-item">⚠ ${this.escapeHtml(e)}</div>`)
      .join('');
  },

  /** Clear all form error messages. */
  clearFormErrors() {
    this.elements.formErrors().innerHTML = '';
  },

  /* ==========================================================
     NAVIGATION
     ========================================================== */

  /**
   * Switch visible view and update nav button states.
   * @param {string} viewName - "home" or "appointments"
   */
  showView(viewName) {
    // Toggle views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelector(`#${viewName}-view`).classList.add('active');

    // Toggle nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
  },

  /* ==========================================================
     TOAST NOTIFICATIONS
     ========================================================== */

  /**
   * Show a toast notification that auto-dismisses.
   * @param {string} message
   * @param {"success"|"error"|"info"} type
   */
  showToast(message, type = 'info') {
    const container = this.elements.toastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  },

  /* ==========================================================
     UTILITIES
     ========================================================== */

  /**
   * Escape HTML to prevent XSS.
   * @param {string} str
   * @returns {string}
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
