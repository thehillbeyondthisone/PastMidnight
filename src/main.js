/**
 * Past Midnight - Main Entry Point
 * Initialize the screensaver engine and UI
 */

import { engine } from './core/ScreensaverEngine.js';
import { ControlPanel } from './ui/ControlPanel.js';

// Import all screensavers
import { FlyingToasters } from './screensavers/FlyingToasters.js';
import { StarryNight } from './screensavers/StarryNight.js';
import { Mystify } from './screensavers/Mystify.js';
import { Warp } from './screensavers/Warp.js';
import { Pipes } from './screensavers/Pipes.js';
import { Matrix } from './screensavers/Matrix.js';
import { BouncingLogo } from './screensavers/BouncingLogo.js';
import { Aquarium } from './screensavers/Aquarium.js';

/**
 * Initialize the application
 */
function init() {
    console.log('🌙 Past Midnight - Initializing...');

    // Get canvas and container
    const canvas = document.getElementById('screensaver-canvas');
    const container = document.getElementById('screensaver-container');

    // Initialize engine
    engine.init(canvas, container);

    // Register all screensavers
    engine.register(FlyingToasters);
    engine.register(StarryNight);
    engine.register(Mystify);
    engine.register(Warp);
    engine.register(Pipes);
    engine.register(Matrix);
    engine.register(BouncingLogo);
    engine.register(Aquarium);

    // Initialize control panel
    const controlPanel = new ControlPanel();

    // Populate screensaver gallery
    populateGallery();

    // Setup preview button
    document.getElementById('preview-screensaver').addEventListener('click', () => {
        engine.start();
    });

    console.log('✨ Past Midnight - Ready!');
    console.log(`📦 ${engine.getAll().length} screensavers loaded`);
}

/**
 * Populate the screensaver gallery
 */
function populateGallery() {
    const grid = document.getElementById('screensaver-grid');
    const screensavers = engine.getAll();

    screensavers.forEach(({ metadata }) => {
        const card = document.createElement('div');
        card.className = 'screensaver-card';
        card.innerHTML = `
            <div class="preview-icon">${metadata.icon}</div>
            <h3>${metadata.name}</h3>
            <p>${metadata.description}</p>
        `;

        // Click to preview
        card.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.screensaver-card').forEach(c => {
                c.classList.remove('active');
            });
            card.classList.add('active');

            // Start screensaver
            engine.start(metadata.id);
        });

        grid.appendChild(card);
    });

    // Mark the selected screensaver as active
    if (engine.settings.selectedScreensaver) {
        const activeCard = Array.from(grid.children).find(card => {
            return card.querySelector('h3').textContent ===
                   engine.get(engine.settings.selectedScreensaver).metadata.name;
        });
        if (activeCard) {
            activeCard.classList.add('active');
        }
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for debugging
window.PastMidnight = {
    engine,
    version: '1.0.0'
};
