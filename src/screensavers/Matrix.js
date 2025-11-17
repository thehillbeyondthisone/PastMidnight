import { BaseScreensaver } from '../core/BaseScreensaver.js';

/**
 * Matrix - Falling green characters
 * Inspired by The Matrix (1999)
 */
export class Matrix extends BaseScreensaver {
    static get metadata() {
        return {
            id: 'matrix',
            name: 'Matrix Code',
            description: 'Falling green characters like in The Matrix',
            icon: '💚',
            author: 'After Dark Collection',
            year: 1999
        };
    }

    init() {
        this.fontSize = 16;
        this.columns = Math.floor(this.width / this.fontSize);
        this.drops = [];

        // Characters to use
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        this.katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.allChars = this.characters + this.katakana;

        // Initialize drops
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = {
                y: this.randomInt(-50, 0),
                speed: this.random(0.5, 1.5),
                chars: []
            };
        }

        this.lastUpdate = 0;
        this.updateInterval = 50; // Update every 50ms
    }

    draw(timestamp) {
        // Fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (timestamp - this.lastUpdate < this.updateInterval) {
            return;
        }
        this.lastUpdate = timestamp;

        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const drop = this.drops[i];

            // Random character
            const char = this.allChars[this.randomInt(0, this.allChars.length - 1)];
            const x = i * this.fontSize;
            const y = drop.y * this.fontSize;

            // Draw character with bright green
            this.ctx.fillStyle = '#0f0';
            this.ctx.fillText(char, x, y);

            // Add glow effect to the head
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#0f0';
            this.ctx.fillText(char, x, y);
            this.ctx.shadowBlur = 0;

            // Draw fading trail
            const trailLength = 20;
            for (let j = 1; j < trailLength; j++) {
                const trailY = (drop.y - j) * this.fontSize;
                if (trailY > 0) {
                    const opacity = 1 - (j / trailLength);
                    this.ctx.fillStyle = `rgba(0, 255, 0, ${opacity * 0.8})`;
                    const trailChar = this.allChars[this.randomInt(0, this.allChars.length - 1)];
                    this.ctx.fillText(trailChar, x, trailY);
                }
            }

            // Move drop
            drop.y += drop.speed;

            // Reset drop if it's past the screen
            if (drop.y * this.fontSize > this.height && Math.random() > 0.975) {
                drop.y = 0;
                drop.speed = this.random(0.5, 1.5);
            }
        }
    }

    resizeCanvas() {
        super.resizeCanvas();
        this.columns = Math.floor(this.width / this.fontSize);

        // Reinitialize drops
        const oldDrops = this.drops;
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            if (oldDrops[i]) {
                this.drops[i] = oldDrops[i];
            } else {
                this.drops[i] = {
                    y: this.randomInt(-50, 0),
                    speed: this.random(0.5, 1.5),
                    chars: []
                };
            }
        }
    }
}
