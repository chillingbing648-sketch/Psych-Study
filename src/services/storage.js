/**
 * Storage Service — Handles all data persistence
 * Provides versioned, safe localStorage access with migrations
 */

class StorageService {
  constructor() {
    this.version = 2; // Increment when schema changes
    this.prefix = 'psychstudy_';
    this.schemas = {
      progress: { version: 1, default: {} },
      notes: { version: 1, default: [] },
      quizResults: { version: 2, default: [] },
      settings: { version: 1, default: { theme: 'light', streak: 0 } },
      masteryData: { version: 1, default: {} },
      importedPDFs: { version: 1, default: [] }
    };
  }

  async init() {
    // Run any necessary migrations
    await this.migrate();
  }

  async migrate() {
    // Future: handle data migrations when schema changes
    // For now, just validate existing data
    Object.entries(this.schemas).forEach(([key, schema]) => {
      const stored = this.getRaw(key);
      if (stored && stored._version !== undefined && stored._version < schema.version) {
        // Run migration if needed
        console.log(`Migrating ${key} from v${stored._version} to v${schema.version}`);
      }
    });
  }

  /**
   * Get value from localStorage
   * @param {string} key - Data key
   * @param {any} defaultValue - Default if not found or corrupted
   * @returns {any} Stored value or default
   */
  get(key, defaultValue = null) {
    try {
      const fullKey = this.prefix + key;
      const stored = localStorage.getItem(fullKey);
      if (!stored) return defaultValue;
      
      const parsed = JSON.parse(stored);
      return parsed;
    } catch (err) {
      console.error(`Error reading storage key "${key}":`, err);
      return defaultValue;
    }
  }

  /**
   * Get raw item (internal)
   */
  getRaw(key) {
    try {
      const fullKey = this.prefix + key;
      const stored = localStorage.getItem(fullKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Set value in localStorage
   * @param {string} key - Data key
   * @param {any} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      const fullKey = this.prefix + key;
      localStorage.setItem(fullKey, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Error writing storage key "${key}":`, err);
      return false;
    }
  }

  /**
   * Remove a key from storage
   */
  remove(key) {
    try {
      const fullKey = this.prefix + key;
      localStorage.removeItem(fullKey);
      return true;
    } catch (err) {
      console.error(`Error removing storage key "${key}":`, err);
      return false;
    }
  }

  /**
   * Clear all app data
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (err) {
      console.error('Error clearing storage:', err);
      return false;
    }
  }

  /**
   * Add item to an array (notes, results, etc.)
   */
  addToArray(key, item) {
    const arr = this.get(key, []);
    if (!Array.isArray(arr)) return false;
    arr.unshift(item); // Add to front
    return this.set(key, arr);
  }

  /**
   * Remove item from array by ID
   */
  removeFromArray(key, itemId) {
    const arr = this.get(key, []);
    if (!Array.isArray(arr)) return false;
    const filtered = arr.filter(item => item.id !== itemId);
    return this.set(key, filtered);
  }

  /**
   * Update item in array
   */
  updateInArray(key, itemId, updates) {
    const arr = this.get(key, []);
    if (!Array.isArray(arr)) return false;
    const updated = arr.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    return this.set(key, updated);
  }

  /**
   * Get size of storage (for debugging)
   */
  getSize() {
    let size = 0;
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        size += localStorage.getItem(key).length;
      }
    });
    return size;
  }
}

export const storageService = new StorageService();
