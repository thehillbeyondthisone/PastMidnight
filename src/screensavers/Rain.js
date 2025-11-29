import { BaseScreensaver } from '../core/BaseScreensaver.js';

/**
 * Rain - Classic After Dark screensaver
 * Peaceful rain falling with ripple effects when drops hit the ground
 */
export class Rain extends BaseScreensaver {
    static get metadata() {
        return {
            id: 'rain',
            name: 'Rain',
            description: 'Peaceful rain falling with ripple effects',
            icon: '🌧️',
            author: 'Berkeley Systems',
            year: 1990
        };
    }

    static get defaultSettings() {
        return {
            intensity: 'normal',      // light, normal, heavy
            windSpeed: 'calm',        // calm, breezy, windy
            showLightning: true,
            showRipples: true
        };
    }

    init() {
        this.drops = [];
        this.ripples = [];
        this.lastSpawn = 0;
        this.lightningTimer = 0;
        this.lightningFlash = 0;

        // Apply settings
        const settings = { ...this.constructor.defaultSettings, ...this.config };

        // Intensity affects drop count
        if (settings.intensity === 'light') {
            this.dropFrequency = 50;  // milliseconds between drops
        } else if (settings.intensity === 'heavy') {
            this.dropFrequency = 10;
        } else {
            this.dropFrequency = 25;
        }

        // Wind affects horizontal movement
        if (settings.windSpeed === 'calm') {
            this.windForce = 0;
        } else if (settings.windSpeed === 'breezy') {
            this.windForce = 1;
        } else {
            this.windForce = 3;
        }

        this.showLightning = settings.showLightning;
        this.showRipples = settings.showRipples;

        // Ground level where ripples form
        this.groundLevel = this.height * 0.85;
    }

    draw(timestamp) {
        // Dark gray stormy sky background
        const bgGradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        bgGradient.addColorStop(0, '#1a1a2e');
        bgGradient.addColorStop(0.7, '#16213e');
        bgGradient.addColorStop(1, '#0f3460');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Lightning flash effect
        if (this.lightningFlash > 0) {
            this.ctx.globalAlpha = this.lightningFlash;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.globalAlpha = 1;
            this.lightningFlash -= 0.1;
        }

        // Spawn new raindrops
        const elapsed = timestamp - this.lastSpawn;
        if (elapsed > this.dropFrequency) {
            this.spawnDrop();
            this.lastSpawn = timestamp;
        }

        // Random lightning
        if (this.showLightning) {
            this.lightningTimer++;
            if (this.lightningTimer > 200 && Math.random() < 0.005) {
                this.lightningFlash = 0.4;
                this.lightningTimer = 0;
            }
        }

        // Update and draw drops
        for (let i = this.drops.length - 1; i >= 0; i--) {
            const drop = this.drops[i];

            // Update position
            drop.y += drop.speed;
            drop.x += this.windForce;

            // Draw drop
            this.ctx.strokeStyle = 'rgba(174, 214, 241, 0.6)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x - this.windForce, drop.y - drop.length);
            this.ctx.stroke();

            // Check if hit ground
            if (drop.y >= this.groundLevel) {
                if (this.showRipples) {
                    this.createRipple(drop.x, this.groundLevel);
                }
                this.drops.splice(i, 1);
            }
        }

        // Update and draw ripples
        for (let i = this.ripples.length - 1; i >= 0; i--) {
            const ripple = this.ripples[i];

            ripple.radius += 1;
            ripple.alpha -= 0.02;

            if (ripple.alpha <= 0) {
                this.ripples.splice(i, 1);
                continue;
            }

            this.ctx.strokeStyle = `rgba(174, 214, 241, ${ripple.alpha})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Draw puddle/ground
        this.ctx.fillStyle = 'rgba(15, 52, 96, 0.3)';
        this.ctx.fillRect(0, this.groundLevel, this.width, this.height - this.groundLevel);
    }

    spawnDrop() {
        this.drops.push({
            x: Math.random() * this.width,
            y: -10,
            speed: 8 + Math.random() * 4,
            length: 15 + Math.random() * 10
        });
    }

    createRipple(x, y) {
        this.ripples.push({
            x: x,
            y: y,
            radius: 0,
            alpha: 0.6
        });
    }
}
