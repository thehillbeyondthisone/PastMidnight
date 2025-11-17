import { engine } from '../core/ScreensaverEngine.js';

/**
 * ControlPanel - Nostalgic control panel UI
 * Manages the settings interface
 */
export class ControlPanel {
    constructor() {
        this.modal = document.getElementById('control-panel-modal');
        this.screensaverSelect = document.getElementById('screensaver-select');
        this.idleTimeoutInput = document.getElementById('idle-timeout');
        this.randomModeCheckbox = document.getElementById('random-mode');
        this.enableCheckbox = document.getElementById('enable-screensaver');
        this.miniPreview = document.getElementById('mini-preview');

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Open/Close
        document.getElementById('open-control-panel').addEventListener('click', () => {
            this.open();
        });

        document.getElementById('close-control-panel').addEventListener('click', () => {
            this.close();
        });

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Test button
        document.getElementById('test-screensaver').addEventListener('click', () => {
            this.saveSettings();
            this.close();
            engine.start();
        });

        // Save button
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
            this.close();
        });

        // Screensaver selection change
        this.screensaverSelect.addEventListener('change', () => {
            this.updatePreview();
        });

        // Random mode change
        this.randomModeCheckbox.addEventListener('change', () => {
            this.screensaverSelect.disabled = this.randomModeCheckbox.checked;
        });
    }

    open() {
        this.modal.classList.remove('hidden');
        this.populateScreensavers();
        this.loadCurrentSettings();
        this.updatePreview();
    }

    close() {
        this.modal.classList.add('hidden');
    }

    populateScreensavers() {
        this.screensaverSelect.innerHTML = '';

        const screensavers = engine.getAll();
        screensavers.forEach(({ metadata }) => {
            const option = document.createElement('option');
            option.value = metadata.id;
            option.textContent = `${metadata.icon} ${metadata.name}`;
            this.screensaverSelect.appendChild(option);
        });
    }

    loadCurrentSettings() {
        const settings = engine.settings;

        this.screensaverSelect.value = settings.selectedScreensaver || '';
        this.idleTimeoutInput.value = Math.floor(settings.idleTimeout / 60000);
        this.randomModeCheckbox.checked = settings.randomMode;
        this.enableCheckbox.checked = settings.enabled;

        this.screensaverSelect.disabled = settings.randomMode;
    }

    saveSettings() {
        engine.updateSettings({
            selectedScreensaver: this.screensaverSelect.value,
            idleTimeout: parseInt(this.idleTimeoutInput.value) * 60000,
            randomMode: this.randomModeCheckbox.checked,
            enabled: this.enableCheckbox.checked
        });

        console.log('✅ Settings saved');
    }

    updatePreview() {
        const selectedId = this.screensaverSelect.value;
        const screensaver = engine.get(selectedId);

        if (!screensaver) return;

        // Update preview text
        this.miniPreview.innerHTML = `
            <div style="color: #666; padding: 20px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 10px;">
                    ${screensaver.metadata.icon}
                </div>
                <div style="font-size: 14px; font-weight: bold;">
                    ${screensaver.metadata.name}
                </div>
                <div style="font-size: 11px; margin-top: 5px;">
                    ${screensaver.metadata.description}
                </div>
                <div style="font-size: 10px; margin-top: 10px; color: #999;">
                    ${screensaver.metadata.author} (${screensaver.metadata.year})
                </div>
            </div>
        `;
    }
}
