import { BaseScreensaver } from '../core/BaseScreensaver.js';

/**
 * Warp - Starfield warp speed effect
 * Stars rushing toward you like entering warp speed
 */
export class Warp extends BaseScreensaver {
    static get metadata() {
        return {
            id: 'warp',
            name: 'Warp!',
            description: 'Stars rushing past at warp speed',
            icon: '🌟',
            author: 'After Dark Collection',
            year: 1990
        };
    }

    init() {
        this.stars = [];
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.starCount = 200;
        this.speed = 5;

        // Create stars
        for (let i = 0; i < this.starCount; i++) {
            this.createStar();
        }
    }

    createStar() {
        // Random angle
        const angle = Math.random() * Math.PI * 2;

        // Random distance from center
        const distance = Math.random() * 10;

        this.stars.push({
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            z: Math.random() * this.width,
            prevX: 0,
            prevY: 0,
            color: this.randomStarColor()
        });
    }

    randomStarColor() {
        const colors = [
            '#ffffff',
            '#e3f2fd',
            '#fce4ec',
            '#e8f5e9',
            '#fff3e0',
            '#f3e5f5'
        ];
        return colors[this.randomInt(0, colors.length - 1)];
    }

    draw(timestamp) {
        // Black background
        this.fillBackground('#000');

        // Update and draw stars
        for (let i = this.stars.length - 1; i >= 0; i--) {
            const star = this.stars[i];

            // Save previous position
            star.prevX = star.x / star.z * this.width + this.centerX;
            star.prevY = star.y / star.z * this.width + this.centerY;

            // Move star forward
            star.z -= this.speed;

            // Reset star if it's too close
            if (star.z <= 0) {
                this.stars.splice(i, 1);
                this.createStar();
                continue;
            }

            // Calculate screen position
            const screenX = star.x / star.z * this.width + this.centerX;
            const screenY = star.y / star.z * this.width + this.centerY;

            // Skip if off screen
            if (screenX < 0 || screenX > this.width || screenY < 0 || screenY > this.height) {
                this.stars.splice(i, 1);
                this.createStar();
                continue;
            }

            // Calculate size based on distance
            const size = (1 - star.z / this.width) * 3;
            const opacity = 1 - (star.z / this.width);

            // Draw trail
            this.ctx.strokeStyle = star.color;
            this.ctx.globalAlpha = opacity * 0.5;
            this.ctx.lineWidth = size;
            this.ctx.beginPath();
            this.ctx.moveTo(star.prevX, star.prevY);
            this.ctx.lineTo(screenX, screenY);
            this.ctx.stroke();

            // Draw star
            this.ctx.fillStyle = star.color;
            this.ctx.globalAlpha = opacity;
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Reset alpha
        this.ctx.globalAlpha = 1;
    }

    resizeCanvas() {
        super.resizeCanvas();
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }
}
