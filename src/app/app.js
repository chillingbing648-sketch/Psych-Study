/**
 * PsychStudy — Main Application Entry
 * Coordinates all modules and manages app lifecycle
 */
import { router } from './router.js';
import { storageService } from '../services/storage.js';
import { masteryEngine } from '../services/mastery.js';
import { UIController } from '../components/ui-controller.js';

class PsychStudyApp {
  constructor() {
    this.router = router;
    this.storage = storageService;
    this.mastery = masteryEngine;
    this.ui = new UIController();
    this.state = {
      currentPage: 'dashboard',
      currentTopic: null,
      studyMode: 'deep',
      user: null,
      theme: 'light'
    };
  }

  async init() {
    try {
      // Load persisted data
      await this.storage.init();
      
      // Load user theme preference
      const theme = this.storage.get('user_theme', 'light');
      this.setTheme(theme);
      
      // Initialize UI components
      this.ui.init();
      
      // Set up router
      this.router.init(this);
      
      // Navigate to dashboard
      this.navigate('dashboard');
      
      console.log('✓ PsychStudy 2.0 initialized');
    } catch (err) {
      console.error('App initialization failed:', err);
      this.ui.showError('Failed to load app. Please refresh the page.');
    }
  }

  navigate(page) {
    this.state.currentPage = page;
    this.router.navigate(page);
  }

  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.storage.set('user_theme', theme);
    this.ui.updateThemeButton(theme);
  }

  toggleTheme() {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

// Create singleton instance
const app = new PsychStudyApp();

// Export for use in modules
export default app;
