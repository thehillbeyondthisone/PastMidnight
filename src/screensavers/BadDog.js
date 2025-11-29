import { BaseScreensaver } from '../core/BaseScreensaver.js';

/**
 * Bad Dog - Classic After Dark screensaver
 * A mischievous dog runs across the screen, tearing and scratching it
 */
export class BadDog extends BaseScreensaver {
    static get metadata() {
        return {
            id: 'bad-dog',
            name: 'Bad Dog',
            description: 'A mischievous dog tears and scratches your screen',
            icon: '🐕',
            author: 'Berkeley Systems',
            year: 1990
        };
    }

    static get defaultSettings() {
        return {
            dogSpeed: 'normal',       // slow, normal, fast
            destruction: 'normal',     // mild, normal, chaos
            showPaws: true
        };
    }

    init() {
        this.dog = null;
        this.tears = [];
        this.scratches = [];
        this.pawprints = [];
        this.nextDogTime = 2000;
        this.lastDogSpawn = 0;

        // Apply settings
        const settings = { ...this.constructor.defaultSettings, ...this.config };

        // Speed multiplier
        if (settings.dogSpeed === 'slow') {
            this.speedMultiplier = 0.7;
        } else if (settings.dogSpeed === 'fast') {
            this.speedMultiplier = 1.5;
        } else {
            this.speedMultiplier = 1.0;
        }

        // Destruction frequency
        if (settings.destruction === 'mild') {
            this.destructionRate = 0.3;
        } else if (settings.destruction === 'chaos') {
            this.destructionRate = 1.5;
        } else {
            this.destructionRate = 1.0;
        }

        this.showPaws = settings.showPaws;

        // Initial white background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    draw(timestamp) {
        // Don't clear - we want damage to persist
        // Only fill initially or when specifically needed

        // Spawn dog periodically
        if (!this.dog && timestamp - this.lastDogSpawn > this.nextDogTime) {
            this.spawnDog();
            this.lastDogSpawn = timestamp;
            this.nextDogTime = 3000 + Math.random() * 4000;
        }

        // Update and draw dog
        if (this.dog) {
            this.updateDog(timestamp);
            this.drawDog();

            // Create damage while dog runs
            if (Math.random() < 0.1 * this.destructionRate) {
                this.createTear(this.dog.x, this.dog.y);
            }
            if (Math.random() < 0.15 * this.destructionRate) {
                this.createScratch(this.dog.x, this.dog.y);
            }
            if (this.showPaws && Math.random() < 0.2) {
                this.createPawprint(this.dog.x, this.dog.y + 20);
            }
        }

        // Draw all damage effects
        this.drawTears();
        this.drawScratches();
        this.drawPawprints();
    }

    spawnDog() {
        const fromLeft = Math.random() < 0.5;
        this.dog = {
            x: fromLeft ? -50 : this.width + 50,
            y: this.height * 0.4 + Math.random() * (this.height * 0.3),
            direction: fromLeft ? 1 : -1,
            speed: (4 + Math.random() * 3) * this.speedMultiplier,
            frame: 0,
            legPhase: 0
        };
    }

    updateDog(timestamp) {
        if (!this.dog) return;

        this.dog.x += this.dog.speed * this.dog.direction;
        this.dog.legPhase += 0.3;
        this.dog.frame++;

        // Remove dog when off screen
        if ((this.dog.direction > 0 && this.dog.x > this.width + 50) ||
            (this.dog.direction < 0 && this.dog.x < -50)) {
            this.dog = null;
        }
    }

    drawDog() {
        if (!this.dog) return;

        const ctx = this.ctx;
        const x = this.dog.x;
        const y = this.dog.y;
        const dir = this.dog.direction;

        ctx.save();
        ctx.translate(x, y);
        if (dir < 0) ctx.scale(-1, 1);

        // Dog body (simplified cartoon dog)
        ctx.fillStyle = '#8B4513';  // Brown

        // Body
        ctx.fillRect(-15, -10, 30, 20);

        // Head
        ctx.beginPath();
        ctx.arc(15, -8, 12, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = '#D2691E';
        ctx.beginPath();
        ctx.arc(23, -5, 6, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(26, -5, 3, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.beginPath();
        ctx.arc(17, -12, 2, 0, Math.PI * 2);
        ctx.fill();

        // Ear
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(12, -18, 5, 8, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Legs (animated)
        const legOffset = Math.sin(this.dog.legPhase) * 3;
        ctx.fillStyle = '#8B4513';

        // Front legs
        ctx.fillRect(-8, 10, 4, 12 + legOffset);
        ctx.fillRect(4, 10, 4, 12 - legOffset);

        // Back legs
        ctx.fillRect(-20, 10, 4, 12 - legOffset);
        ctx.fillRect(-12, 10, 4, 12 + legOffset);

        // Tail
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-15, -5);
        ctx.quadraticCurveTo(-25, -15, -28, -8);
        ctx.stroke();

        ctx.restore();
    }

    createTear(x, y) {
        this.tears.push({
            x: x + (Math.random() - 0.5) * 40,
            y: y + (Math.random() - 0.5) * 30,
            width: 30 + Math.random() * 50,
            height: 40 + Math.random() * 60,
            angle: (Math.random() - 0.5) * 0.4,
            age: 0
        });
    }

    createScratch(x, y) {
        this.scratches.push({
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 30,
            length: 40 + Math.random() * 80,
            angle: Math.random() * Math.PI * 2,
            width: 2 + Math.random() * 3,
            age: 0
        });
    }

    createPawprint(x, y) {
        this.pawprints.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y,
            size: 8 + Math.random() * 4,
            angle: Math.random() * Math.PI * 2,
            age: 0
        });
    }

    drawTears() {
        for (const tear of this.tears) {
            const ctx = this.ctx;

            ctx.save();
            ctx.translate(tear.x, tear.y);
            ctx.rotate(tear.angle);

            // Create jagged tear effect
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.moveTo(0, 0);

            const points = 8;
            for (let i = 0; i <= points; i++) {
                const px = (i / points) * tear.width - tear.width / 2;
                const py = (Math.random() - 0.5) * tear.height;
                ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();

            // White "torn paper" edge
            ctx.strokeStyle = '#f0f0f0';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
        }
    }

    drawScratches() {
        for (const scratch of this.scratches) {
            const ctx = this.ctx;

            ctx.save();
            ctx.translate(scratch.x, scratch.y);
            ctx.rotate(scratch.angle);

            // Draw multiple parallel scratch lines
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = scratch.width;
            ctx.lineCap = 'round';

            for (let i = 0; i < 3; i++) {
                const offset = (i - 1) * 5;
                ctx.beginPath();
                ctx.moveTo(0, offset);
                ctx.lineTo(scratch.length, offset);
                ctx.stroke();
            }

            ctx.restore();
        }
    }

    drawPawprints() {
        for (const paw of this.pawprints) {
            const ctx = this.ctx;

            ctx.save();
            ctx.translate(paw.x, paw.y);
            ctx.rotate(paw.angle);

            ctx.fillStyle = 'rgba(139, 69, 19, 0.4)';

            // Paw pad
            ctx.beginPath();
            ctx.ellipse(0, 0, paw.size, paw.size * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Toe pads
            const toeSize = paw.size * 0.4;
            ctx.beginPath();
            ctx.arc(-paw.size * 0.5, -paw.size * 0.8, toeSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, -paw.size * 1.0, toeSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(paw.size * 0.5, -paw.size * 0.8, toeSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }
}
