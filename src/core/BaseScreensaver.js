/**
 * BaseScreensaver - Abstract base class for all screensavers
 * Provides common functionality and interface that all screensavers must implement
 */
export class BaseScreensaver {
    constructor(canvas, config = {}) {
        if (new.target === BaseScreensaver) {
            throw new Error('BaseScreensaver is abstract and cannot be instantiated directly');
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = config;
        this.isRunning = false;
        this.animationFrameId = null;
        this.startTime = null;

        // Resize canvas to fill screen
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Metadata about this screensaver
     * Must be overridden by child classes
     */
    static get metadata() {
        throw new Error('Child class must implement static metadata getter');
    }

    /**
     * Resize canvas to match window dimensions
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    /**
     * Initialize screensaver
     * Override this to set up initial state
     */
    init() {
        // Override in child class
    }

    /**
     * Main animation loop
     * Override this to implement screensaver animation
     */
    draw(timestamp) {
        throw new Error('Child class must implement draw() method');
    }

    /**
     * Start the screensaver
     */
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.startTime = performance.now();
        this.init();
        this.animate();
    }

    /**
     * Stop the screensaver
     */
    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.cleanup();
    }

    /**
     * Cleanup resources
     * Override this to clean up any resources
     */
    cleanup() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Internal animation loop
     */
    animate(timestamp = 0) {
        if (!this.isRunning) return;

        this.draw(timestamp);
        this.animationFrameId = requestAnimationFrame((ts) => this.animate(ts));
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Get elapsed time since start
     */
    getElapsedTime(timestamp) {
        return timestamp - this.startTime;
    }

    /**
     * Utility: Generate random number between min and max
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Utility: Generate random integer between min and max
     */
    randomInt(min, max) {
        return Math.floor(this.random(min, max + 1));
    }

    /**
     * Utility: Generate random color
     */
    randomColor() {
        return `hsl(${this.randomInt(0, 360)}, ${this.randomInt(50, 100)}%, ${this.randomInt(40, 80)}%)`;
    }

    /**
     * Utility: Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Utility: Fill canvas with color
     */
    fillBackground(color = '#000') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}
