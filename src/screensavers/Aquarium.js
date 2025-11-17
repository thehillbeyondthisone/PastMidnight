import { BaseScreensaver } from '../core/BaseScreensaver.js';

/**
 * Aquarium - Peaceful fish swimming in a tank
 * Classic After Dark screensaver
 */
export class Aquarium extends BaseScreensaver {
    static get metadata() {
        return {
            id: 'aquarium',
            name: 'Aquarium',
            description: 'Peaceful fish swimming with bubbles',
            icon: '🐠',
            author: 'Berkeley Systems',
            year: 1990
        };
    }

    init() {
        this.fish = [];
        this.bubbles = [];
        this.plants = [];

        // Create fish
        for (let i = 0; i < 8; i++) {
            this.createFish();
        }

        // Create plants
        for (let i = 0; i < 5; i++) {
            this.plants.push({
                x: this.random(50, this.width - 50),
                segments: this.randomInt(3, 6),
                height: this.random(80, 150),
                sway: this.random(0.01, 0.03),
                offset: Math.random() * Math.PI * 2
            });
        }

        this.lastBubble = 0;
        this.bubbleInterval = 500;
    }

    createFish() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD93D', '#6BCF7F'];

        this.fish.push({
            x: this.random(0, this.width),
            y: this.random(100, this.height - 150),
            size: this.random(20, 40),
            speed: this.random(0.5, 2),
            direction: Math.random() > 0.5 ? 1 : -1,
            color: colors[this.randomInt(0, colors.length - 1)],
            tailAngle: 0,
            tailSpeed: this.random(0.1, 0.2),
            bobAngle: Math.random() * Math.PI * 2,
            bobSpeed: this.random(0.02, 0.05)
        });
    }

    draw(timestamp) {
        // Water gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#001a33');
        gradient.addColorStop(0.5, '#003366');
        gradient.addColorStop(1, '#004d7a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw plants
        this.drawPlants(timestamp);

        // Draw bubbles
        this.updateBubbles(timestamp);

        // Draw fish
        this.fish.forEach(fish => {
            // Update fish
            fish.x += fish.speed * fish.direction;
            fish.tailAngle += fish.tailSpeed;
            fish.bobAngle += fish.bobSpeed;

            const bob = Math.sin(fish.bobAngle) * 5;
            fish.y += bob * 0.1;

            // Wrap around
            if (fish.direction > 0 && fish.x > this.width + 50) {
                fish.x = -50;
            } else if (fish.direction < 0 && fish.x < -50) {
                fish.x = this.width + 50;
            }

            this.drawFish(fish);
        });

        // Draw sandy bottom
        this.ctx.fillStyle = '#C2A878';
        this.ctx.fillRect(0, this.height - 50, this.width, 50);

        // Add some rocks
        this.ctx.fillStyle = '#8B7355';
        for (let i = 0; i < 10; i++) {
            const x = (i / 10) * this.width + this.random(-20, 20);
            const rockSize = this.random(15, 30);
            this.ctx.beginPath();
            this.ctx.ellipse(x, this.height - 25, rockSize, rockSize * 0.6, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawFish(fish) {
        this.ctx.save();
        this.ctx.translate(fish.x, fish.y);
        this.ctx.scale(fish.direction, 1);

        const size = fish.size;

        // Body
        this.ctx.fillStyle = fish.color;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Tail
        const tailWag = Math.sin(fish.tailAngle) * 0.3;
        this.ctx.save();
        this.ctx.translate(-size, 0);
        this.ctx.rotate(tailWag);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-size * 0.8, -size * 0.5);
        this.ctx.lineTo(-size * 0.8, size * 0.5);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();

        // Eye
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(size * 0.5, -size * 0.2, size * 0.15, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(size * 0.5, -size * 0.2, size * 0.08, 0, Math.PI * 2);
        this.ctx.fill();

        // Fins
        this.ctx.fillStyle = fish.color;
        this.ctx.globalAlpha = 0.7;
        this.ctx.beginPath();
        this.ctx.ellipse(0, size * 0.5, size * 0.3, size * 0.4, Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;

        this.ctx.restore();
    }

    drawPlants(timestamp) {
        this.plants.forEach(plant => {
            const sway = Math.sin(timestamp * plant.sway + plant.offset) * 20;

            this.ctx.strokeStyle = '#2E7D32';
            this.ctx.lineWidth = 8;
            this.ctx.lineCap = 'round';

            this.ctx.beginPath();
            this.ctx.moveTo(plant.x, this.height - 50);

            for (let i = 1; i <= plant.segments; i++) {
                const segmentHeight = (plant.height / plant.segments) * i;
                const segmentSway = sway * (i / plant.segments);
                this.ctx.lineTo(plant.x + segmentSway, this.height - 50 - segmentHeight);
            }

            this.ctx.stroke();
        });
    }

    updateBubbles(timestamp) {
        // Spawn new bubbles
        if (timestamp - this.lastBubble > this.bubbleInterval) {
            this.bubbles.push({
                x: this.random(0, this.width),
                y: this.height - 50,
                size: this.random(3, 8),
                speed: this.random(1, 3),
                wobble: this.random(0.5, 1.5),
                wobbleOffset: Math.random() * Math.PI * 2
            });
            this.lastBubble = timestamp;
        }

        // Draw and update bubbles
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            const bubble = this.bubbles[i];

            bubble.y -= bubble.speed;
            bubble.wobbleOffset += 0.05;
            bubble.x += Math.sin(bubble.wobbleOffset) * bubble.wobble;

            // Remove if off screen
            if (bubble.y < -10) {
                this.bubbles.splice(i, 1);
                continue;
            }

            // Draw bubble
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();

            // Bubble highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(
                bubble.x - bubble.size * 0.3,
                bubble.y - bubble.size * 0.3,
                bubble.size * 0.3,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }
    }
}
