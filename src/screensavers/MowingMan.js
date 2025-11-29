import { BaseScreensaver } from '../core/BaseScreensaver.js';

/**
 * Mowing Man - Classic After Dark screensaver
 * A person with a lawn mower cuts the screen in strips, revealing grass underneath
 */
export class MowingMan extends BaseScreensaver {
    static get metadata() {
        return {
            id: 'mowing-man',
            name: 'Mowing Man',
            description: 'A lawn mower cuts your screen into neat grass strips',
            icon: '🚜',
            author: 'Berkeley Systems',
            year: 1990
        };
    }

    static get defaultSettings() {
        return {
            mowSpeed: 'normal',        // slow, normal, fast
            pattern: 'horizontal',      // horizontal, vertical, random
            grassStyle: 'normal'        // short, normal, wild
        };
    }

    init() {
        this.mower = null;
        this.mowedStrips = [];
        this.currentStrip = 0;
        this.stripHeight = 40;

        // Apply settings
        const settings = { ...this.constructor.defaultSettings, ...this.config };

        // Speed
        if (settings.mowSpeed === 'slow') {
            this.speed = 2;
        } else if (settings.mowSpeed === 'fast') {
            this.speed = 6;
        } else {
            this.speed = 4;
        }

        // Pattern
        this.pattern = settings.pattern;
        this.isHorizontal = this.pattern === 'horizontal' ||
                           (this.pattern === 'random' && Math.random() < 0.5);

        // Grass style
        if (settings.grassStyle === 'short') {
            this.grassLength = 3;
            this.grassDensity = 0.3;
        } else if (settings.grassStyle === 'wild') {
            this.grassLength = 10;
            this.grassDensity = 0.8;
        } else {
            this.grassLength = 6;
            this.grassDensity = 0.5;
        }

        // Start with white screen
        this.fillBackground('#ffffff');

        // Calculate total strips
        this.totalStrips = this.isHorizontal ?
            Math.ceil(this.height / this.stripHeight) :
            Math.ceil(this.width / this.stripHeight);

        // Spawn first mower
        this.spawnMower();
    }

    draw(timestamp) {
        // Draw all completed mowed strips
        for (const strip of this.mowedStrips) {
            this.drawGrassStrip(strip);
        }

        // Update and draw mower
        if (this.mower) {
            this.updateMower();
            this.drawMower();

            // Draw current strip being mowed
            if (this.isHorizontal) {
                const stripY = this.currentStrip * this.stripHeight;
                const mowedWidth = this.mower.x + 30; // Mower width
                this.drawGrassStrip({
                    x: 0,
                    y: stripY,
                    width: mowedWidth,
                    height: this.stripHeight,
                    horizontal: true
                });
            } else {
                const stripX = this.currentStrip * this.stripHeight;
                const mowedHeight = this.mower.y + 30;
                this.drawGrassStrip({
                    x: stripX,
                    y: 0,
                    width: this.stripHeight,
                    height: mowedHeight,
                    horizontal: false
                });
            }
        }
    }

    spawnMower() {
        if (this.currentStrip >= this.totalStrips) {
            // All done - restart
            this.currentStrip = 0;
            this.mowedStrips = [];
        }

        if (this.isHorizontal) {
            const y = this.currentStrip * this.stripHeight;
            const fromLeft = this.currentStrip % 2 === 0;
            this.mower = {
                x: fromLeft ? -50 : this.width + 50,
                y: y + this.stripHeight / 2,
                direction: fromLeft ? 1 : -1,
                rotation: 0
            };
        } else {
            const x = this.currentStrip * this.stripHeight;
            const fromTop = this.currentStrip % 2 === 0;
            this.mower = {
                x: x + this.stripHeight / 2,
                y: fromTop ? -50 : this.height + 50,
                direction: fromTop ? 1 : -1,
                rotation: Math.PI / 2
            };
        }
    }

    updateMower() {
        if (!this.mower) return;

        if (this.isHorizontal) {
            this.mower.x += this.speed * this.mower.direction;

            // Check if strip complete
            if ((this.mower.direction > 0 && this.mower.x > this.width + 50) ||
                (this.mower.direction < 0 && this.mower.x < -50)) {
                // Save completed strip
                this.mowedStrips.push({
                    x: 0,
                    y: this.currentStrip * this.stripHeight,
                    width: this.width,
                    height: this.stripHeight,
                    horizontal: true
                });
                this.currentStrip++;
                this.mower = null;
                // Spawn next mower after delay
                setTimeout(() => this.spawnMower(), 500);
            }
        } else {
            this.mower.y += this.speed * this.mower.direction;

            // Check if strip complete
            if ((this.mower.direction > 0 && this.mower.y > this.height + 50) ||
                (this.mower.direction < 0 && this.mower.y < -50)) {
                // Save completed strip
                this.mowedStrips.push({
                    x: this.currentStrip * this.stripHeight,
                    y: 0,
                    width: this.stripHeight,
                    height: this.height,
                    horizontal: false
                });
                this.currentStrip++;
                this.mower = null;
                // Spawn next mower after delay
                setTimeout(() => this.spawnMower(), 500);
            }
        }
    }

    drawMower() {
        if (!this.mower) return;

        const ctx = this.ctx;
        const x = this.mower.x;
        const y = this.mower.y;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.mower.rotation);
        if (this.mower.direction < 0) ctx.scale(-1, 1);

        // Lawn mower body
        ctx.fillStyle = '#cc0000';
        ctx.fillRect(-15, -12, 30, 24);

        // Mower deck (green)
        ctx.fillStyle = '#228B22';
        ctx.fillRect(-20, -8, 40, 16);

        // Handle
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-25, -20);
        ctx.stroke();

        // Wheels
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(-12, 10, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(12, 10, 5, 0, Math.PI * 2);
        ctx.fill();

        // Person (stick figure)
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        // Head
        ctx.beginPath();
        ctx.arc(-25, -28, 6, 0, Math.PI * 2);
        ctx.stroke();

        // Body
        ctx.beginPath();
        ctx.moveTo(-25, -22);
        ctx.lineTo(-25, -5);
        ctx.stroke();

        // Arms (holding handle)
        ctx.beginPath();
        ctx.moveTo(-25, -15);
        ctx.lineTo(-25, -20);
        ctx.stroke();

        // Legs
        ctx.beginPath();
        ctx.moveTo(-25, -5);
        ctx.lineTo(-28, 5);
        ctx.moveTo(-25, -5);
        ctx.lineTo(-22, 5);
        ctx.stroke();

        ctx.restore();
    }

    drawGrassStrip(strip) {
        const ctx = this.ctx;

        // Base grass color
        ctx.fillStyle = '#228B22';
        ctx.fillRect(strip.x, strip.y, strip.width, strip.height);

        // Darker stripes for mowed look
        ctx.fillStyle = '#1a6b1a';
        const stripeWidth = 20;
        const stripes = strip.horizontal ?
            Math.ceil(strip.width / stripeWidth) :
            Math.ceil(strip.height / stripeWidth);

        for (let i = 0; i < stripes; i += 2) {
            if (strip.horizontal) {
                ctx.fillRect(
                    strip.x + i * stripeWidth,
                    strip.y,
                    stripeWidth,
                    strip.height
                );
            } else {
                ctx.fillRect(
                    strip.x,
                    strip.y + i * stripeWidth,
                    strip.width,
                    stripeWidth
                );
            }
        }

        // Add grass texture (individual blades)
        ctx.strokeStyle = '#2ea02e';
        ctx.lineWidth = 1;

        const grassBlades = (strip.width * strip.height) / 100 * this.grassDensity;
        for (let i = 0; i < grassBlades; i++) {
            const gx = strip.x + Math.random() * strip.width;
            const gy = strip.y + Math.random() * strip.height;
            const len = Math.random() * this.grassLength;

            ctx.beginPath();
            ctx.moveTo(gx, gy);
            ctx.lineTo(gx + (Math.random() - 0.5) * 2, gy - len);
            ctx.stroke();
        }
    }
}
