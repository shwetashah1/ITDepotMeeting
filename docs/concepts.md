# Web Technologies — Concepts Used in This Project

This document outlines the HTML5, CSS3, and JavaScript concepts implemented across the IT Asset Scheduler application.

---

## HTML5

### Semantic Elements

The application uses semantic HTML5 elements for accessible, meaningful document structure.

| Element | Usage | File |
|---------|-------|------|
| `<header>` | App header with logo and navigation | `index.html` |
| `<nav>` | Primary navigation bar | `index.html` |
| `<main>` | Main content container | `index.html` |
| `<section>` | Dashboard and Appointments views | `index.html` |
| `<article>` | Individual appointment cards | `ui.js` (rendered dynamically) |
| `<footer>` | Page footer | `index.html` |
| `<form>` | Appointment create/edit form | `index.html` |
| `<label>` | Accessible form field labels | `index.html` |

### Data Attributes

Custom `data-*` attributes store metadata on elements, enabling JS interaction without hardcoding values.

- `data-view` — Identifies which view a nav button controls (`home`, `appointments`)
- `data-id` — Links each appointment card to its record ID
- `data-filter-key` / `data-filter-value` — Dashboard stat cards carry filter parameters for deep-linking

### ARIA Accessibility Attributes

- `aria-label` — Provides accessible names for controls without visible labels (search input, filter dropdowns, nav)
- `aria-live="polite"` — Toast notification container announces updates to screen readers
- `aria-hidden="true"` — Hides decorative elements (search icon) from assistive technology
- `role="link"` / `tabindex="0"` — Makes stat cards keyboard-accessible as interactive elements

### Modern Input Types

- `type="email"` — Email fields with built-in format hints
- `type="date"` — Native date picker UI
- `type="time"` — Native time picker with `min`/`max` constraints
- `novalidate` — Disables browser-default validation so custom JS validation handles errors

### Meta Tags

- `<meta name="viewport">` — Enables responsive scaling on mobile devices
- `<meta name="description">` — SEO-friendly page description

---

## CSS3

### Custom Properties (CSS Variables)

The design system is built on CSS variables defined in `:root`, enabling consistent theming and easy updates.

```css
:root {
  --color-primary: #2563eb;
  --color-bg: #f1f5f9;
  --space-md: 1rem;
  --radius-lg: 0.75rem;
  /* ... */
}
```

Variables are organized into categories: **colors**, **spacing**, **typography**, **shapes**, **shadows**, and **transitions**.

### Flexbox

Used for one-dimensional layouts where items flow in a row or column.

- **Header layout** — Logo and nav aligned with `justify-content: space-between`
- **Card actions** — Row of buttons with `gap` spacing
- **Toolbar** — Search and filter controls in a flexible row
- **Navigation** — Buttons spaced with `gap`

Key properties used: `flex-direction`, `align-items`, `justify-content`, `flex-wrap`, `gap`, `flex: 1`

### CSS Grid

Used for two-dimensional layouts with rows and columns.

- **Stats grid** — Responsive grid of stat cards using `auto-fit` with `minmax()`
- **Dashboard bottom** — Two-column layout for widget and recent list
- **Gallery grid** — Responsive card grid using `auto-fill` with `minmax()`
- **Form grid** — Two-column form layout with `grid-column: 1 / -1` for full-width fields

Key properties used: `grid-template-columns`, `auto-fit`, `auto-fill`, `minmax()`, `gap`

### Mobile-First Responsive Design

Base styles target mobile, with `min-width` media queries progressively enhancing for larger screens.

```css
/* Base: mobile (stacked, single column) */
.gallery-grid {
  grid-template-columns: 1fr;
}

/* Tablet (601px+): multi-column */
@media (min-width: 601px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}
```

Two breakpoints: **601px** (tablet) and **1025px** (desktop).

### Transitions

- **Transitions** — Smooth hover effects on cards (`transform`, `box-shadow`), buttons (`background-color`), inputs (`border-color`), and tooltips (`opacity`).

### Other CSS3 Features

| Feature | Usage |
|---------|-------|
| `attr()` | Custom CSS-only tooltips extracting `data-title` values |
| `backdrop-filter: blur()` | Frosted glass effect on sticky header |
| `::placeholder` | Styled placeholder text in search input |
| `::after` | Pseudo-elements for tooltip rendering |
| `box-shadow` | Card elevation, input focus rings |
| `rgba()` | Semi-transparent badge and button backgrounds |
| `text-transform` / `letter-spacing` | Uppercase badge and stat label styling |
| `border-radius` | Rounded corners on cards, buttons, inputs, badges |
| `scroll-behavior: smooth` | Smooth scrolling when form scrolls into view |

---

## JavaScript

### Async/Await and Fetch API

Used for asynchronous data loading without callbacks or `.then()` chains.

```js
async loadAppointments() {
  const response = await fetch('assets/js/data/appointments.json');
  const data = await response.json();
  return data;
}
```

- **Seed data** loaded via `fetch()` from a JSON file (`storage.js`)
- **Live widget** fetches a random quote from a public API (`app.js`)
- **Error handling** with `try/catch` and graceful fallbacks

### localStorage API

Client-side persistence so data survives page refreshes.

```js
localStorage.setItem('itasset_appointments', JSON.stringify(appointments));
JSON.parse(localStorage.getItem('itasset_appointments'));
```

### DOM Manipulation

Direct DOM interaction without any framework.

| Method | Usage |
|--------|-------|
| `querySelector()` / `querySelectorAll()` | Select elements by CSS selector (form fields, containers, nav buttons) |
| `classList.add()` / `remove()` / `toggle()` | Toggle CSS classes (view switching, active states) |
| `innerHTML` | Render dynamic HTML for cards, stats, and lists |
| `createElement()` | Create toast notification elements |
| `textContent` | Safely set text content, also used for HTML escaping |
| `scrollIntoView()` | Smooth scroll to form when editing |

### Event Handling

- **`addEventListener()`** — All interactions use standard event listeners (click, submit, input, change)
- **Event delegation** — Stat card clicks use a single listener on the parent grid, then `e.target.closest()` to identify the clicked card
- **`e.preventDefault()`** — Prevents default form submission and link navigation
- **Debouncing** — Search input uses `setTimeout` to delay filtering until the user pauses typing

```js
let searchTimer;
input.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => this.refreshGallery(), 250);
});
```

### ES6+ Features

| Feature | Example Usage |
|---------|---------------|
| **Arrow functions** | `appointments.filter(a => a.status === 'Scheduled')` |
| **Template literals** | `` `<div class="stat-value">${s.value}</div>` `` |
| **Spread operator** | `{ ...appointment, ...formData, updatedAt: now }` |
| **Destructuring** | `const [hours] = timeStr.split(':').map(Number)` |
| **Optional chaining** | `document.querySelector('.nav-btn.active')?.dataset.view` |
| **`const` / `let`** | Block-scoped variables throughout |
| **`Array.find()`** | Find a specific appointment by ID |
| **`Array.filter()`** | Search and filter appointment list |
| **`Array.map()`** | Transform data arrays into HTML strings |
| **`Array.findIndex()`** | Locate an item's position for in-place updates |
| **`Array.sort()`** | Sort recent appointments by date |
| **Default parameters** | `showForm(appointment = null)` |

### URL and History API

Used for deep-linking from dashboard to filtered appointment views.

```js
const params = new URLSearchParams(window.location.search);
window.history.replaceState({}, '', url);
```

- **`URLSearchParams`** — Reads and writes query parameters (`?status=Scheduled`)
- **`history.replaceState()`** — Updates the URL without triggering a page reload

### Module Pattern (Namespace Objects)

Code is organized into four global namespace objects, each responsible for a single concern.

```
Storage  →  Data loading and persistence
Rules    →  Validation logic (no DOM dependency)
UI       →  All DOM rendering and manipulation
App      →  Orchestration, CRUD, event binding
```

Scripts are loaded in dependency order via `<script>` tags. Each module is a plain object literal — simple, readable, and framework-free.

### XSS Prevention

User input is escaped before rendering into HTML to prevent cross-site scripting.

```js
escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

---

## Summary

| Technology | Key Concepts |
|------------|-------------|
| **HTML5** | Semantic elements, data attributes, ARIA, modern input types |
| **CSS3** | Custom properties, Flexbox, Grid, mobile-first media queries, transitions, animations |
| **JavaScript** | Async/Await, Fetch API, localStorage, DOM manipulation, event delegation, ES6+ syntax, URL API, namespace pattern |
