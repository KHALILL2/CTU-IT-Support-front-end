/**
 * Configuration for BATU Timetable
 * Production-ready settings for GitHub Pages
 */

const CONFIG = {
    // Set to false for production (GitHub Pages)
    DEBUG_MODE: false,
    
    // GitHub Pages deployment
    BASE_URL: '',  // Leave empty for GitHub Pages, or set to '/BATU-Timetable' if needed
    
    // Feature flags
    FEATURES: {
        SEARCH_MODAL: false,  // Not yet implemented
        EXPORT_CALENDAR: false,  // Future feature
        DARK_MODE: false  // Future feature
    }
};

// Production-safe console wrapper
const logger = {
    log: function(...args) {
        if (CONFIG.DEBUG_MODE) {
            console.log(...args);
        }
    },
    error: function(...args) {
        if (CONFIG.DEBUG_MODE) {
            console.error(...args);
        }
    },
    warn: function(...args) {
        if (CONFIG.DEBUG_MODE) {
            console.warn(...args);
        }
    }
};

// Make config available globally
window.CONFIG = CONFIG;
window.logger = logger;
