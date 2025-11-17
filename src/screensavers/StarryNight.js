import { BaseScreensaver } from '../core/BaseScreensaver.js';

/**
 * Starry Night - Classic star field screensaver
 * Stars twinkling and shooting stars occasionally
 */
export class StarryNight extends BaseScreensaver {
    static get metadata() {
        return {
            id: 'starry-night',
            name: 'Starry Night',
            description: 'A peaceful field of twinkling stars',
            icon: '⭐',
            author: 'Berkeley Systems',
            year: 1989
        };
    }

    init() {
        this.stars = [];
        this.shootingStars = [];

        // Create stars
        const starCount = Math.floor((this.width * this.height) / 5000);
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: this.random(0, this.width),
                y: this.random(0, this.height),
                size: this.random(1, 3),
                brightness: Math.random(),
                twinkleSpeed: this.random(0.01, 0.03),
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }

        this.lastShootingStar = 0;
        this.shootingStarInterval = 3000; // Every 3 seconds
    }

    draw(timestamp) {
        // Fill with dark blue-black
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#000814');
        gradient.addColorStop(1, '#001d3d');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw stars
        this.stars.forEach(star => {
            const twinkle = Math.sin(timestamp * star.twinkleSpeed + star.twinkleOffset);
            const brightness = (star.brightness + twinkle) / 2;

            this.ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Add star glow for brighter stars
            if (brightness > 0.7) {
                const glowGradient = this.ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.size * 4
                );
                glowGradient.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.3})`);
                glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                this.ctx.fillStyle = glowGradient;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        // Spawn shooting stars
        if (timestamp - this.lastShootingStar > this.shootingStarInterval) {
            this.spawnShootingStar();
            this.lastShootingStar = timestamp;
        }

        // Draw shooting stars
        for (let i = this.shootingStars.length - 1; i >= 0; i--) {
            const star = this.shootingStars[i];
            const age = timestamp - star.born;
            const life = age / star.lifetime;

            if (life > 1) {
                this.shootingStars.splice(i, 1);
                continue;
            }

            // Update position
            star.x += star.vx;
            star.y += star.vy;

            // Draw trail
            const opacity = 1 - life;
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(star.x, star.y);
            this.ctx.lineTo(star.x - star.vx * 10, star.y - star.vy * 10);
            this.ctx.stroke();

            // Draw head
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Glow
            const glowGradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, 10
            );
            glowGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.5})`);
            glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, 10, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    spawnShootingStar() {
        const angle = this.random(Math.PI / 6, Math.PI / 3); // 30-60 degrees
        const speed = this.random(3, 6);

        this.shootingStars.push({
            x: this.random(0, this.width),
            y: 0,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            born: performance.now(),
            lifetime: this.random(1000, 2000)
        });
    }
}
