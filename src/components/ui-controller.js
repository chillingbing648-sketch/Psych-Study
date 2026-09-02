/**
 * UI Controller — Manages UI interactions and state
 * Handles notifications, modals, loading states, theme
 */

export class UIController {
  constructor() {
    this.toastQueue = [];
  }

  init() {
    this.attachEventListeners();
    this.setupAccessibility();
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Show error notification
   */
  showError(message) {
    this.showToast(message, 'error', 4000);
  }

  /**
   * Show success notification
   */
  showSuccess(message) {
    this.showToast(message, 'success', 3000);
  }

  /**
   * Show loading overlay
   */
  showLoading(message = 'Loading…') {
    const loading = document.getElementById('loading');
    if (loading) {
      document.getElementById('loading-msg').textContent = message;
      loading.classList.remove('hidden');
    }
  }

  /**
   * Hide loading overlay
   */
  hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.add('hidden');
    }
  }

  /**
   * Show modal dialog
   */
  showModal(title, content, actions = []) {
    const modal = document.getElementById('modal');
    if (!modal) return;

    modal.querySelector('[data-modal-title]').textContent = title;
    modal.querySelector('[data-modal-body]').innerHTML = content;
    
    const footer = modal.querySelector('[data-modal-actions]');
    if (footer) {
      footer.innerHTML = actions.map(action => 
        `<button class="btn btn-${action.type || 'outline'}" data-action="${action.id}">${action.label}</button>`
      ).join('');
    }

    modal.classList.remove('hidden');
    this.attachModalActions(actions);
  }

  /**
   * Hide modal
   */
  hideModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  /**
   * Update theme button
   */
  updateThemeButton(theme) {
    const btn = document.getElementById('themeBtn');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  /**
   * Toggle navigation menu (mobile)
   */
  toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
      navLinks.classList.toggle('open');
    }
  }

  /**
   * Set page title and description
   */
  setPageTitle(title, description = '') {
    document.title = `${title} — PsychStudy AI`;
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Theme toggle
    document.getElementById('themeBtn')?.addEventListener('click', () => {
      window.app?.toggleTheme();
    });

    // Mobile menu toggle
    document.querySelector('.hamburger')?.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close modal on overlay click
    document.getElementById('modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal') {
        this.hideModal();
      }
    });

    // Close mobile menu on link click
    document.querySelectorAll('[data-nav-link]').forEach(link => {
      link.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    });
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Esc to close modals
      if (e.key === 'Escape') {
        this.hideModal();
      }
    });
  }

  /**
   * Attach modal action handlers
   */
  attachModalActions(actions) {
    actions.forEach(action => {
      const btn = document.querySelector(`[data-action="${action.id}"]`);
      if (btn && action.handler) {
        btn.addEventListener('click', () => {
          action.handler();
          this.hideModal();
        });
      }
    });
  }

  /**
   * Disable element (for loading states)
   */
  disable(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.disabled = true;
      el.classList.add('disabled');
    });
  }

  /**
   * Enable element
   */
  enable(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.disabled = false;
      el.classList.remove('disabled');
    });
  }
}
