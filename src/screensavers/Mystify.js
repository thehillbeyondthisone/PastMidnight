import { BaseScreensaver } from '../core/BaseScreensaver.js';

/**
 * Mystify - Bouncing polygons with trails
 * Inspired by the classic Windows screensaver
 */
export class Mystify extends BaseScreensaver {
    static get metadata() {
        return {
            id: 'mystify',
            name: 'Mystify',
            description: 'Mesmerizing bouncing polygons with colorful trails',
            icon: '💫',
            author: 'After Dark Collection',
            year: 1991
        };
    }

    static get defaultSettings() {
        return {
            polygonCount: 'normal', // single, normal, many
            trailLength: 'normal',   // short, normal, long
            speed: 'normal'          // slow, normal, fast
        };
    }

    init() {
        this.polygons = [];

        // Apply settings
        const settings = { ...this.constructor.defaultSettings, ...this.config };

        // Trail length
        if (settings.trailLength === 'short') {
            this.trailLength = 10;
            this.fadeAmount = 0.15;
        } else if (settings.trailLength === 'long') {
            this.trailLength = 40;
            this.fadeAmount = 0.05;
        } else {
            this.trailLength = 20;
            this.fadeAmount = 0.1;
        }

        // Speed multiplier
        if (settings.speed === 'slow') {
            this.speedMultiplier = 0.5;
        } else if (settings.speed === 'fast') {
            this.speedMultiplier = 2;
        } else {
            this.speedMultiplier = 1;
        }

        // Polygon count
        let count = 2;
        if (settings.polygonCount === 'single') count = 1;
        if (settings.polygonCount === 'many') count = 4;

        // Create polygons
        for (let i = 0; i < count; i++) {
            this.polygons.push(this.createPolygon());
        }
    }

    createPolygon() {
        const corners = 4; // Quadrilateral
        const color = this.randomColor();
        const points = [];

        // Initialize corner positions
        for (let i = 0; i < corners; i++) {
            points.push({
                x: this.random(0, this.width),
                y: this.random(0, this.height),
                vx: this.random(-2, 2) * this.speedMultiplier,
                vy: this.random(-2, 2) * this.speedMultiplier,
                history: []
            });
        }

        return {
            points,
            color,
            lineWidth: 2
        };
    }

    draw(timestamp) {
        // Fade effect instead of clearing
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeAmount})`;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Update and draw polygons
        this.polygons.forEach(polygon => {
            // Update each point
            polygon.points.forEach(point => {
                // Save current position to history
                point.history.push({ x: point.x, y: point.y });
                if (point.history.length > this.trailLength) {
                    point.history.shift();
                }

                // Update position
                point.x += point.vx;
                point.y += point.vy;

                // Bounce off edges
                if (point.x <= 0 || point.x >= this.width) {
                    point.vx *= -1;
                    point.x = Math.max(0, Math.min(this.width, point.x));
                }
                if (point.y <= 0 || point.y >= this.height) {
                    point.vy *= -1;
                    point.y = Math.max(0, Math.min(this.height, point.y));
                }
            });

            // Draw trail
            const maxHistoryLength = polygon.points[0].history.length;
            for (let i = 0; i < maxHistoryLength; i++) {
                const opacity = (i / maxHistoryLength) * 0.8;

                this.ctx.strokeStyle = polygon.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla');
                this.ctx.lineWidth = polygon.lineWidth;
                this.ctx.beginPath();

                polygon.points.forEach((point, idx) => {
                    if (point.history[i]) {
                        if (idx === 0) {
                            this.ctx.moveTo(point.history[i].x, point.history[i].y);
                        } else {
                            this.ctx.lineTo(point.history[i].x, point.history[i].y);
                        }
                    }
                });

                this.ctx.closePath();
                this.ctx.stroke();
            }

            // Draw current polygon
            this.ctx.strokeStyle = polygon.color;
            this.ctx.lineWidth = polygon.lineWidth;
            this.ctx.beginPath();

            polygon.points.forEach((point, idx) => {
                if (idx === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });

            this.ctx.closePath();
            this.ctx.stroke();
        });
    }
}
