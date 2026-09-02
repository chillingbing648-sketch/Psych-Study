/**
 * Router — Client-side page navigation
 * Maps pages to modules and handles navigation state
 */

export class Router {
  constructor() {
    this.app = null;
    this.pages = new Map();
    this.currentPage = null;
  }

  init(app) {
    this.app = app;
    this.registerPages();
    this.attachNavListeners();
  }

  registerPages() {
    const pages = [
      'dashboard',
      'study',
      'flashcards',
      'quiz',
      'exam',
      'notes',
      'progress'
    ];
    pages.forEach(page => this.pages.set(page, true));
  }

  navigate(page) {
    if (!this.pages.has(page)) {
      console.warn(`Page "${page}" not found`);
      return;
    }

    // Hide all pages
    document.querySelectorAll('main[data-page]').forEach(p => {
      p.classList.remove('active');
    });

    // Show target page
    const el = document.querySelector(`main[data-page="${page}"]`);
    if (el) {
      el.classList.add('active');
      this.currentPage = page;
      
      // Update navbar
      this.updateNavBar(page);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Trigger page-specific init if needed
      this.onPageChange(page);
    }
  }

  updateNavBar(page) {
    document.querySelectorAll('[data-nav-link]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.navLink === page);
    });
  }

  onPageChange(page) {
    // Page-specific initialization can happen here
    // Triggered by page modules when needed
  }

  attachNavListeners() {
    document.querySelectorAll('[data-nav-link]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = btn.dataset.navLink;
        this.navigate(page);
        // Close mobile menu if open
        document.getElementById('navLinks')?.classList.remove('open');
      });
    });
  }
}

export const router = new Router();
