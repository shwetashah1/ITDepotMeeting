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

    container.textContent = '';
    stats.forEach(s => {
      const card = document.createElement('div');
      card.className = 'stat-card stat-card-link';
      card.dataset.filterKey = s.filterKey;
      card.dataset.filterValue = s.filterValue;
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
      card.title = `View ${s.label} appointments`;

      const val = document.createElement('div');
      val.className = 'stat-value';
      val.textContent = s.value;

      const lbl = document.createElement('div');
      lbl.className = 'stat-label';
      lbl.textContent = s.label;

      card.appendChild(val);
      card.appendChild(lbl);
      container.appendChild(card);
    });
  },

  /**
   * Render the recent appointments list (last 5 by createdAt).
   * @param {Array} appointments
   */
  renderRecentList(appointments) {
    const container = this.elements.recentList();
    container.textContent = '';

    const sorted = [...appointments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const header = document.createElement('div');
    header.className = 'card-header';
    const h4 = document.createElement('h4');
    h4.textContent = '🕐 Recent Appointments';
    header.appendChild(h4);
    container.appendChild(header);

    const body = document.createElement('div');
    body.className = 'card-body';

    if (sorted.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'No appointments yet.';
      body.appendChild(empty);
    } else {
      sorted.forEach(a => {
        const item = document.createElement('div');
        item.className = 'recent-item';

        const name = document.createElement('span');
        name.className = 'recent-item-name';
        name.textContent = a.employeeName;

        const meta = document.createElement('span');
        meta.className = 'recent-item-meta';

        const badge = document.createElement('span');
        badge.className = `badge badge-${a.status.toLowerCase()}`;
        badge.textContent = a.status;

        meta.appendChild(badge);
        meta.appendChild(document.createTextNode(` ${a.date}`));

        item.appendChild(name);
        item.appendChild(meta);
        body.appendChild(item);
      });
    }
    container.appendChild(body);
  },

  /* ==========================================================
     LIVE WIDGET
     ========================================================== */

  /**
   * Render fetched quote data in the widget.
   * @param {{ quote: string, author: string }} data
   */
  renderWidget(data) {
    const quoteEl = document.querySelector('#widget-quote');
    const authorEl = document.querySelector('#widget-author');
    if (!quoteEl || !authorEl) return;

    quoteEl.className = 'widget-quote';
    quoteEl.textContent = `"${data.quote}"`;

    authorEl.className = 'widget-author';
    authorEl.textContent = `— ${data.author}`;
  },

  /**
   * Show error fallback in widget.
   * @param {string} message
   */
  renderWidgetError(message) {
    const quoteEl = document.querySelector('#widget-quote');
    const authorEl = document.querySelector('#widget-author');
    if (!quoteEl || !authorEl) return;

    quoteEl.className = 'widget-loading';
    quoteEl.textContent = message;

    authorEl.textContent = '';
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
    container.textContent = '';

    if (appointments.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'No appointments match your criteria.';
      container.appendChild(empty);
      return;
    }

    appointments.forEach(a => {
      container.appendChild(this.buildCard(a));
    });
  },

  /**
   * Build a single appointment card DOM element.
   * @param {Object} a - appointment object
   * @returns {HTMLElement} article element
   */
  buildCard(a) {
    const article = document.createElement('article');
    article.className = 'card';
    article.dataset.id = a.id;

    const statusClass = `badge-${a.status.toLowerCase()}`;
    const typeClass   = `badge-${a.appointmentType.toLowerCase()}`;

    // Header
    const header = document.createElement('div');
    header.className = 'card-header';

    const titleGroup = document.createElement('div');
    titleGroup.className = 'card-title-group';

    const h4 = document.createElement('h4');
    h4.className = `status-${a.status.toLowerCase()}`;
    h4.textContent = a.status;

    const subtitle = document.createElement('div');
    subtitle.className = 'card-subtitle';
    subtitle.textContent = a.employeeName;

    titleGroup.appendChild(h4);
    titleGroup.appendChild(subtitle);
    header.appendChild(titleGroup);

    const headerRight = document.createElement('div');
    headerRight.className = 'card-header-right';

    const actions = this.getCardActions(a);
    if (actions.length > 0) {
      const actionsTop = document.createElement('div');
      actionsTop.className = 'card-actions-top';
      actions.forEach(btn => actionsTop.appendChild(btn));
      headerRight.appendChild(actionsTop);
    }

    const typeBadge = document.createElement('span');
    typeBadge.className = `badge ${typeClass}`;
    typeBadge.textContent = a.appointmentType;
    headerRight.appendChild(typeBadge);

    header.appendChild(headerRight);
    article.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'card-body';

    const email = document.createElement('span');
    email.textContent = `📧 ${a.employeeEmail}`;
    body.appendChild(email);

    const sup = document.createElement('span');
    sup.textContent = `👤 Supervisor: ${a.supervisorName}`;
    body.appendChild(sup);

    const datetime = document.createElement('span');
    datetime.textContent = `📅 ${a.date} at ${a.time}`;
    body.appendChild(datetime);

    if (a.notes) {
      const notes = document.createElement('span');
      notes.textContent = `📝 ${a.notes}`;
      body.appendChild(notes);
    }

    article.appendChild(body);
    return article;
  },

  /**
   * Determine which action buttons to show based on status.
   * @param {Object} a
   * @returns {HTMLElement[]} array of button elements
   */
  getCardActions(a) {
    const buttons = [];
    const id = a.id;

    const createBtn = (icon, title, onclickFn) => {
      const btn = document.createElement('button');
      btn.className = 'btn-icon has-tooltip';
      btn.dataset.title = title;
      btn.textContent = icon;
      btn.onclick = () => App[onclickFn](id);
      return btn;
    };

    if (a.status === 'Scheduled') {
      buttons.push(createBtn('✏️', 'Edit', 'startEdit'));
      buttons.push(createBtn('✔', 'Confirm', 'confirmAppointment'));
      buttons.push(createBtn('✖', 'Cancel', 'cancelAppointment'));
    } else if (a.status === 'Confirmed') {
      buttons.push(createBtn('✏️', 'Edit', 'startEdit'));
      buttons.push(createBtn('✔', 'Resolve', 'resolveAppointment'));
      buttons.push(createBtn('✖', 'Cancel', 'cancelAppointment'));
    }

    return buttons;
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
      document.querySelector('#emp-name').value    = appointment.employeeName;
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
    container.textContent = '';
    errors.forEach(e => {
      const div = document.createElement('div');
      div.className = 'form-error-item';
      div.textContent = `⚠ ${e}`;
      container.appendChild(div);
    });
  },

  /** Clear all form error messages. */
  clearFormErrors() {
    this.elements.formErrors().textContent = '';
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
  }
};

