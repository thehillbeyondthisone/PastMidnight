import { BaseScreensaver } from '../core/BaseScreensaver.js';

/**
 * Starry Night - Classic star field screensaver
 * Amber stars twinkling over a city skyline with occasional shooting stars
 */
export class StarryNight extends BaseScreensaver {
    static get metadata() {
        return {
            id: 'starry-night',
            name: 'Starry Night',
            description: 'Twinkling amber stars over a peaceful city skyline',
            icon: '⭐',
            author: 'Berkeley Systems',
            year: 1989
        };
    }

    static get defaultSettings() {
        return {
            starDensity: 'medium',        // low, medium, high
            shootingStarFrequency: 'normal', // rare, normal, frequent
            showBuildings: true,
            starColor: 'amber'            // amber, white, blue
        };
    }

    init() {
        this.stars = [];
        this.shootingStars = [];
        this.buildings = [];

        // Apply settings
        const settings = { ...this.constructor.defaultSettings, ...this.config };

        // Star density
        let densityMultiplier = 1;
        if (settings.starDensity === 'low') densityMultiplier = 0.5;
        if (settings.starDensity === 'high') densityMultiplier = 2;

        // Create stars (only in sky area, not over buildings)
        const skyHeight = this.height * 0.75; // Buildings take up bottom 25%
        const starCount = Math.floor((this.width * skyHeight) / 5000 * densityMultiplier);

        for (let i = 0; i < starCount; i++) {
            // Pick star color based on setting
            let color;
            if (settings.starColor === 'amber') {
                color = { r: 255, g: this.randomInt(180, 220), b: this.randomInt(100, 150) };
            } else if (settings.starColor === 'blue') {
                color = { r: 200, g: 220, b: 255 };
            } else {
                color = { r: 255, g: 255, b: 255 };
            }

            this.stars.push({
                x: this.random(0, this.width),
                y: this.random(0, skyHeight),
                size: this.random(0.8, 2.5),
                brightness: Math.random(),
                twinkleSpeed: this.random(0.01, 0.03),
                twinkleOffset: Math.random() * Math.PI * 2,
                color: color
            });
        }

        // Generate city skyline
        if (settings.showBuildings) {
            this.generateCityline();
        }

        // Shooting star frequency
        this.lastShootingStar = 0;
        if (settings.shootingStarFrequency === 'rare') {
            this.shootingStarInterval = 8000;
        } else if (settings.shootingStarFrequency === 'frequent') {
            this.shootingStarInterval = 2000;
        } else {
            this.shootingStarInterval = 4000;
        }
    }

    generateCityline() {
        const buildingCount = Math.floor(this.width / 80);
        let currentX = 0;

        for (let i = 0; i < buildingCount; i++) {
            const width = this.random(60, 120);
            const height = this.random(this.height * 0.15, this.height * 0.35);

            this.buildings.push({
                x: currentX,
                width: width,
                height: height,
                windows: this.generateWindows(width, height)
            });

            currentX += width;
        }
    }

    generateWindows(buildingWidth, buildingHeight) {
        const windows = [];
        const cols = Math.floor(buildingWidth / 15);
        const rows = Math.floor(buildingHeight / 20);

        for (let row = 1; row < rows; row++) {
            for (let col = 1; col < cols; col++) {
                // Random chance for window to be lit
                if (Math.random() > 0.3) {
                    windows.push({
                        x: col * (buildingWidth / cols),
                        y: row * (buildingHeight / rows),
                        lit: Math.random() > 0.5
                    });
                }
            }
        }

        return windows;
    }

    draw(timestamp) {
        // Fill with dark night gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#000510');
        gradient.addColorStop(0.6, '#001428');
        gradient.addColorStop(1, '#1a1a2e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw stars
        this.stars.forEach(star => {
            const twinkle = Math.sin(timestamp * star.twinkleSpeed + star.twinkleOffset);
            const brightness = (star.brightness + twinkle) / 2;

            // Use the star's color
            this.ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${brightness})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Add star glow for brighter stars
            if (brightness > 0.7) {
                const glowGradient = this.ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.size * 4
                );
                glowGradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${brightness * 0.3})`);
                glowGradient.addColorStop(1, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, 0)`);

                this.ctx.fillStyle = glowGradient;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        // Draw city buildings
        this.drawBuildings();

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

    drawBuildings() {
        this.buildings.forEach(building => {
            const buildingY = this.height - building.height;

            // Building silhouette
            this.ctx.fillStyle = '#0a0a1a';
            this.ctx.fillRect(building.x, buildingY, building.width, building.height);

            // Windows
            building.windows.forEach(window => {
                if (window.lit) {
                    // Randomly twinkle windows
                    const twinkle = Math.random() > 0.95 ? 0.5 : 1;
                    this.ctx.fillStyle = `rgba(255, 220, 150, ${0.6 * twinkle})`;
                } else {
                    this.ctx.fillStyle = 'rgba(100, 100, 120, 0.2)';
                }
                this.ctx.fillRect(
                    building.x + window.x - 2,
                    buildingY + window.y - 3,
                    4,
                    6
                );
            });

            // Building edge highlight
            this.ctx.strokeStyle = 'rgba(50, 50, 70, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(building.x, buildingY, building.width, building.height);
        });
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
