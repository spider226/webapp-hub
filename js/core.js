/**
 * Core application framework.
 * Provides state management, storage, routing, and app initialization.
 */

const App = {
  _state: {},
  _listeners: {},
  _config: {},

  /**
   * Initialize the application.
   * @param {Object} config - App configuration
   * @param {string} config.name - App name
   * @param {string} config.storageKey - localStorage key prefix
   * @param {Object} config.initialState - Initial state object
   * @param {Object} config.pages - { pageName: renderFunction }
   * @param {Function} config.onInit - Called after init
   */
  init(config) {
    this._config = config;
    this._state = this._loadState() || Utils.clone(config.initialState || {});
    this._listeners = {};

    // Expose for debugging
    if (config.debug) window.__appState = this._state;

    if (config.onInit) config.onInit();
  },

  /** Get state value by key path (supports dot notation) */
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this._state);
  },

  /** Set state and notify listeners */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!obj[key]) obj[key] = {};
      return obj[key];
    }, this._state);
    target[lastKey] = value;
    this._saveState();
    this._notify(path);
  },

  /** Update multiple state values at once */
  setMultiple(updates) {
    for (const [path, value] of Object.entries(updates)) {
      const keys = path.split('.');
      const lastKey = keys.pop();
      const target = keys.reduce((obj, key) => {
        if (!obj[key]) obj[key] = {};
        return obj[key];
      }, this._state);
      target[lastKey] = value;
    }
    this._saveState();
    for (const path of Object.keys(updates)) {
      this._notify(path);
    }
  },

  /** Subscribe to state changes */
  on(path, callback) {
    if (!this._listeners[path]) this._listeners[path] = [];
    this._listeners[path].push(callback);
    return () => {
      this._listeners[path] = this._listeners[path].filter(cb => cb !== callback);
    };
  },

  /** Notify listeners of a state change */
  _notify(path) {
    // Notify exact path listeners
    const exact = this._listeners[path] || [];
    exact.forEach(cb => cb(this.get(path)));

    // Notify wildcard listeners
    const wildcard = this._listeners['*'] || [];
    wildcard.forEach(cb => cb(path, this.get(path)));

    // Notify parent path listeners
    const parts = path.split('.');
    while (parts.length > 1) {
      parts.pop();
      const parentPath = parts.join('.');
      const listeners = this._listeners[parentPath] || [];
      listeners.forEach(cb => cb(this.get(parentPath)));
    }
  },

  /** Save state to localStorage */
  _saveState() {
    try {
      localStorage.setItem(this._config.storageKey, JSON.stringify(this._state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  },

  /** Load state from localStorage */
  _loadState() {
    try {
      const raw = localStorage.getItem(this._config.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /** Export all data as JSON file download */
  exportData(filename) {
    const blob = new Blob([JSON.stringify(this._state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || (this._config.name + '-backup-' + Utils.today() + '.json');
    a.click();
    URL.revokeObjectURL(url);
  },

  /** Import data from JSON file */
  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          this._state = data;
          this._saveState();
          this._notify('*');
          resolve(data);
        } catch (err) {
          reject(new Error('JSON 解析失败'));
        }
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file);
    });
  },

  /** Reset all data to initial state */
  resetData() {
    this._state = Utils.clone(this._config.initialState || {});
    this._saveState();
    this._notify('*');
  },

  /** Destroy the app (clear all data) */
  destroy() {
    localStorage.removeItem(this._config.storageKey);
    this._state = {};
    this._listeners = {};
  },

  /** Simple client-side router */
  router: {
    _current: '',
    _routes: {},

    register(routes) {
      this._routes = routes;
      window.addEventListener('hashchange', () => this._handle());
      this._handle();
    },

    navigate(hash) {
      window.location.hash = hash;
    },

    _handle() {
      const hash = window.location.hash.slice(1) || 'home';
      this._current = hash;
      const handler = this._routes[hash];
      if (handler) handler();
    },

    current() {
      return this._current;
    }
  },

  /** Get app config */
  getConfig() {
    return this._config;
  }
};
