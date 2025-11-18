/**
 * ScreensaverEngine - Core engine for managing screensavers
 * Handles registration, activation, deactivation, and configuration
 */
export class ScreensaverEngine {
    constructor() {
        this.screensavers = new Map();
        this.currentScreensaver = null;
        this.canvas = null;
        this.container = null;

        // Default settings
        this.settings = {
            enabled: true,
            idleTimeout: 3 * 60 * 1000, // 3 minutes in milliseconds
            randomMode: false,
            selectedScreensaver: null,
        };

        // Idle detection
        this.idleTimer = null;
        this.lastActivity = Date.now();

        // Load settings from localStorage
        this.loadSettings();

        // Bind methods
        this.handleActivity = this.handleActivity.bind(this);
        this.checkIdle = this.checkIdle.bind(this);
    }

    /**
     * Initialize the engine
     */
    init(canvas, container) {
        this.canvas = canvas;
        this.container = container;

        // Set up activity listeners
        this.setupActivityListeners();

        // Start idle checking
        this.startIdleDetection();

        console.log('✨ ScreensaverEngine initialized');
    }

    /**
     * Register a screensaver
     */
    register(ScreensaverClass) {
        if (!ScreensaverClass.metadata) {
            throw new Error('Screensaver must have metadata');
        }

        const metadata = ScreensaverClass.metadata;

        this.screensavers.set(metadata.id, {
            class: ScreensaverClass,
            metadata: metadata,
        });

        console.log(`📦 Registered screensaver: ${metadata.name}`);

        // Set as default if first screensaver or if settings say so
        if (!this.settings.selectedScreensaver && this.screensavers.size === 1) {
            this.settings.selectedScreensaver = metadata.id;
        }
    }

    /**
     * Get all registered screensavers
     */
    getAll() {
        return Array.from(this.screensavers.values());
    }

    /**
     * Get screensaver by ID
     */
    get(id) {
        return this.screensavers.get(id);
    }

    /**
     * Start a specific screensaver
     */
    start(screensaverId = null) {
        // Stop current screensaver if running
        if (this.currentScreensaver) {
            this.stop();
        }

        // Determine which screensaver to start
        let id = screensaverId || this.settings.selectedScreensaver;

        // Random mode
        if (this.settings.randomMode || !id) {
            const screensaverIds = Array.from(this.screensavers.keys());
            id = screensaverIds[Math.floor(Math.random() * screensaverIds.length)];
        }

        const screensaver = this.screensavers.get(id);
        if (!screensaver) {
            console.error(`❌ Screensaver not found: ${id}`);
            return;
        }

        // Create and start screensaver instance
        const ScreensaverClass = screensaver.class;
        this.currentScreensaver = new ScreensaverClass(this.canvas);
        this.currentScreensaver.start();

        // Show container
        this.container.classList.remove('screensaver-hidden');
        this.container.classList.add('screensaver-active');

        console.log(`🚀 Started screensaver: ${screensaver.metadata.name}`);

        // Emit event
        this.emit('screensaver:started', { id, metadata: screensaver.metadata });
    }

    /**
     * Stop current screensaver
     */
    stop() {
        if (this.currentScreensaver) {
            this.currentScreensaver.stop();
            this.currentScreensaver = null;
        }

        // Hide container
        this.container.classList.remove('screensaver-active');
        this.container.classList.add('screensaver-hidden');

        // Reset activity timer
        this.resetIdleTimer();

        console.log('⏹️ Stopped screensaver');

        // Emit event
        this.emit('screensaver:stopped');
    }

    /**
     * Update settings
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        console.log('💾 Settings updated', this.settings);
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('past-midnight-settings', JSON.stringify(this.settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('past-midnight-settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    }

    /**
     * Setup activity listeners
     */
    setupActivityListeners() {
        const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
        events.forEach(event => {
            document.addEventListener(event, this.handleActivity);
        });
    }

    /**
     * Handle user activity
     */
    handleActivity(event) {
        // If screensaver is active, stop it and prevent default action
        if (this.currentScreensaver) {
            event.preventDefault();
            this.stop();
            return;
        }

        // Update last activity time
        this.lastActivity = Date.now();
    }

    /**
     * Start idle detection
     */
    startIdleDetection() {
        // Check every second
        this.idleCheckInterval = setInterval(this.checkIdle, 1000);
    }

    /**
     * Check if user is idle
     */
    checkIdle() {
        if (!this.settings.enabled) return;
        if (this.currentScreensaver) return;

        const now = Date.now();
        const idleTime = now - this.lastActivity;

        if (idleTime >= this.settings.idleTimeout) {
            this.start();
        }
    }

    /**
     * Reset idle timer
     */
    resetIdleTimer() {
        this.lastActivity = Date.now();
    }

    /**
     * Simple event system
     */
    on(event, callback) {
        if (!this.listeners) {
            this.listeners = {};
        }
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (!this.listeners || !this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }

    /**
     * Cleanup
     */
    destroy() {
        this.stop();
        clearInterval(this.idleCheckInterval);

        const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
        events.forEach(event => {
            document.removeEventListener(event, this.handleActivity);
        });
    }
}

// Create singleton instance
export const engine = new ScreensaverEngine();
