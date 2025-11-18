import { engine } from '../core/ScreensaverEngine.js';

/**
 * Authentic After Dark Control Panel
 * Manages the settings interface with live preview and per-module settings
 */
export class ControlPanel {
    constructor() {
        this.modal = document.getElementById('control-panel-modal');
        this.moduleList = document.getElementById('module-list');
        this.moduleSettings = document.getElementById('module-settings');
        this.previewCanvas = document.getElementById('preview-canvas');
        this.idleTimeoutInput = document.getElementById('idle-timeout');
        this.randomModeCheckbox = document.getElementById('random-mode');
        this.enableCheckbox = document.getElementById('enable-screensaver');

        this.selectedModuleId = null;
        this.previewScreensaver = null;
        this.moduleSettingsData = {}; // Store settings for each module

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

        document.getElementById('cancel-settings').addEventListener('click', () => {
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
            this.saveAllSettings();
            this.close();
            engine.start();
        });

        // Save button
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveAllSettings();
            this.close();
        });

        // Random mode change
        this.randomModeCheckbox.addEventListener('change', () => {
            if (this.randomModeCheckbox.checked) {
                // Deselect module
                this.selectedModuleId = null;
                this.renderModuleList();
                this.updatePreview();
            }
        });
    }

    open() {
        this.modal.classList.remove('hidden');
        this.loadSettings();
        this.renderModuleList();
        this.setupPreviewCanvas();

        // Select first module if nothing selected
        if (!this.selectedModuleId && !this.randomModeCheckbox.checked) {
            const screensavers = engine.getAll();
            if (screensavers.length > 0) {
                this.selectModule(screensavers[0].metadata.id);
            }
        }

        this.updatePreview();
    }

    close() {
        this.modal.classList.add('hidden');
        this.stopPreview();
    }

    setupPreviewCanvas() {
        const monitor = document.getElementById('monitor-screen');
        const rect = monitor.getBoundingClientRect();

        this.previewCanvas.width = rect.width;
        this.previewCanvas.height = rect.height;
    }

    loadSettings() {
        const settings = engine.settings;

        this.selectedModuleId = settings.selectedScreensaver;
        this.idleTimeoutInput.value = Math.floor(settings.idleTimeout / 60000);
        this.randomModeCheckbox.checked = settings.randomMode;
        this.enableCheckbox.checked = settings.enabled;

        // Load module-specific settings from localStorage
        try {
            const saved = localStorage.getItem('past-midnight-module-settings');
            if (saved) {
                this.moduleSettingsData = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load module settings:', e);
        }
    }

    saveAllSettings() {
        // Save current module settings if any are displayed
        this.saveCurrentModuleSettings();

        // Save general settings
        engine.updateSettings({
            selectedScreensaver: this.selectedModuleId,
            idleTimeout: parseInt(this.idleTimeoutInput.value) * 60000,
            randomMode: this.randomModeCheckbox.checked,
            enabled: this.enableCheckbox.checked
        });

        // Save module-specific settings
        try {
            localStorage.setItem('past-midnight-module-settings', JSON.stringify(this.moduleSettingsData));
        } catch (e) {
            console.error('Failed to save module settings:', e);
        }

        console.log('✅ All settings saved');
    }

    renderModuleList() {
        this.moduleList.innerHTML = '';

        const screensavers = engine.getAll();
        screensavers.forEach(({ metadata }) => {
            const item = document.createElement('li');
            item.className = 'module-list-item';
            if (metadata.id === this.selectedModuleId) {
                item.classList.add('selected');
            }

            item.innerHTML = `
                <span class="module-icon">${metadata.icon}</span>
                <span>${metadata.name}</span>
            `;

            item.addEventListener('click', () => {
                this.selectModule(metadata.id);
            });

            this.moduleList.appendChild(item);
        });
    }

    selectModule(moduleId) {
        this.selectedModuleId = moduleId;
        this.randomModeCheckbox.checked = false;
        this.renderModuleList();
        this.renderModuleSettings();
        this.updatePreview();
    }

    renderModuleSettings() {
        const screensaver = engine.get(this.selectedModuleId);
        if (!screensaver) {
            this.moduleSettings.innerHTML = '<div class="no-settings">No module selected</div>';
            return;
        }

        const ScreensaverClass = screensaver.class;
        const defaultSettings = ScreensaverClass.defaultSettings || {};

        // Get saved settings for this module
        const savedSettings = this.moduleSettingsData[this.selectedModuleId] || {};
        const currentSettings = { ...defaultSettings, ...savedSettings };

        // If no settings available
        if (Object.keys(defaultSettings).length === 0) {
            this.moduleSettings.innerHTML = `
                <div class="module-settings-title">${screensaver.metadata.name}</div>
                <div class="no-settings">No configurable settings for this module</div>
            `;
            return;
        }

        // Build settings UI
        let html = `<div class="module-settings-title">${screensaver.metadata.name} Settings</div>`;
        html += '<div class="settings-group">';

        for (const [key, value] of Object.entries(defaultSettings)) {
            const label = this.formatLabel(key);
            const currentValue = currentSettings[key];

            html += '<div class="setting-row">';
            html += `<label class="setting-label">${label}:</label>`;
            html += '<div class="setting-value">';

            // Detect setting type from value
            if (typeof value === 'boolean') {
                html += `<label class="win95-checkbox-label">
                    <input type="checkbox"
                           class="win95-checkbox module-setting"
                           data-setting="${key}"
                           ${currentValue ? 'checked' : ''}>
                </label>`;
            } else if (typeof value === 'number') {
                html += `<input type="number"
                               class="win95-input module-setting"
                               data-setting="${key}"
                               value="${currentValue}"
                               style="width: 80px;">`;
            } else {
                // String - create dropdown from common values
                const options = this.getOptionsForSetting(key, defaultSettings);
                html += `<select class="win95-select module-setting" data-setting="${key}">`;
                options.forEach(opt => {
                    html += `<option value="${opt}" ${currentValue === opt ? 'selected' : ''}>${this.formatLabel(opt)}</option>`;
                });
                html += '</select>';
            }

            html += '</div>';
            html += '</div>';
        }

        html += '</div>';
        this.moduleSettings.innerHTML = html;

        // Add change listeners
        this.moduleSettings.querySelectorAll('.module-setting').forEach(input => {
            input.addEventListener('change', () => {
                this.saveCurrentModuleSettings();
                this.updatePreview();
            });
        });
    }

    saveCurrentModuleSettings() {
        if (!this.selectedModuleId) return;

        const settings = {};
        this.moduleSettings.querySelectorAll('.module-setting').forEach(input => {
            const key = input.dataset.setting;
            if (input.type === 'checkbox') {
                settings[key] = input.checked;
            } else if (input.type === 'number') {
                settings[key] = parseFloat(input.value);
            } else {
                settings[key] = input.value;
            }
        });

        this.moduleSettingsData[this.selectedModuleId] = settings;
    }

    getOptionsForSetting(key, defaultSettings) {
        // Extract options from comments in code or use common defaults
        const comment = defaultSettings[key];

        // Common patterns
        if (key.includes('speed') || key.includes('Speed')) {
            return ['slow', 'normal', 'fast'];
        }
        if (key.includes('density') || key.includes('Density')) {
            return ['low', 'normal', 'high'];
        }
        if (key.includes('size') || key.includes('Size')) {
            return ['small', 'normal', 'large'];
        }
        if (key.includes('color') || key.includes('Color')) {
            return ['amber', 'white', 'blue', 'green', 'red'];
        }
        if (key.includes('frequency') || key.includes('Frequency')) {
            return ['rare', 'normal', 'frequent'];
        }
        if (key.includes('ratio') || key.includes('Ratio')) {
            return ['mostly-toasters', 'normal', 'mostly-toast'];
        }

        // Default
        return [typeof comment === 'string' ? comment : 'normal'];
    }

    formatLabel(str) {
        return str
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, s => s.toUpperCase())
            .trim()
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    updatePreview() {
        this.stopPreview();

        if (!this.selectedModuleId) {
            // Show "random" or no selection
            const ctx = this.previewCanvas.getContext('2d');
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
            ctx.fillStyle = '#666';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(
                this.randomModeCheckbox.checked ? 'Random Module' : 'No module selected',
                this.previewCanvas.width / 2,
                this.previewCanvas.height / 2
            );
            return;
        }

        const screensaver = engine.get(this.selectedModuleId);
        if (!screensaver) return;

        // Get current settings for this module
        const moduleSettings = this.moduleSettingsData[this.selectedModuleId] || {};

        // Create screensaver instance with settings
        const ScreensaverClass = screensaver.class;
        this.previewScreensaver = new ScreensaverClass(this.previewCanvas, moduleSettings);
        this.previewScreensaver.start();
    }

    stopPreview() {
        if (this.previewScreensaver) {
            this.previewScreensaver.stop();
            this.previewScreensaver = null;
        }
    }
}
