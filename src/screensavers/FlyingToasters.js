import { BaseScreensaver } from '../core/BaseScreensaver.js';

/**
 * Flying Toasters - The most iconic After Dark screensaver
 * Features toasters with wings and toast flying across the screen
 */
export class FlyingToasters extends BaseScreensaver {
    static get metadata() {
        return {
            id: 'flying-toasters',
            name: 'Flying Toasters',
            description: 'The legendary flying toasters with wings and toast',
            icon: '🍞',
            author: 'Berkeley Systems',
            year: 1989
        };
    }

    init() {
        this.objects = [];
        this.spawnTimer = 0;
        this.spawnInterval = 2000; // Spawn every 2 seconds

        // Create initial objects
        for (let i = 0; i < 5; i++) {
            this.spawnObject(i * 1000);
        }
    }

    spawnObject(delay = 0) {
        const isToaster = Math.random() > 0.3; // 70% toasters, 30% toast
        const size = isToaster ? this.random(60, 100) : this.random(30, 50);

        this.objects.push({
            type: isToaster ? 'toaster' : 'toast',
            x: this.width + 100,
            y: this.random(50, this.height - 50),
            size: size,
            speed: this.random(0.5, 1.5),
            wingAngle: 0,
            wingSpeed: this.random(0.05, 0.1),
            rotation: 0,
            rotationSpeed: isToaster ? 0 : this.random(-0.02, 0.02),
            spawnDelay: delay,
            born: performance.now() + delay
        });
    }

    draw(timestamp) {
        // Clear with black background
        this.fillBackground('#000');

        // Spawn new objects
        if (timestamp - this.spawnTimer > this.spawnInterval) {
            this.spawnObject();
            this.spawnTimer = timestamp;
        }

        // Update and draw objects
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const obj = this.objects[i];

            // Skip if not yet born
            if (timestamp < obj.born) continue;

            // Update position
            obj.x -= obj.speed;
            obj.wingAngle += obj.wingSpeed;
            obj.rotation += obj.rotationSpeed;

            // Remove if off screen
            if (obj.x < -200) {
                this.objects.splice(i, 1);
                continue;
            }

            // Draw object
            if (obj.type === 'toaster') {
                this.drawToaster(obj);
            } else {
                this.drawToast(obj);
            }
        }
    }

    drawToaster(obj) {
        this.ctx.save();
        this.ctx.translate(obj.x, obj.y);

        const w = obj.size;
        const h = obj.size * 0.8;

        // Toaster body
        this.ctx.fillStyle = '#c0c0c0';
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 2;

        // Main body with rounded corners
        this.ctx.beginPath();
        this.roundRect(-w/2, -h/2, w, h, 5);
        this.ctx.fill();
        this.ctx.stroke();

        // Toaster slots
        this.ctx.fillStyle = '#333';
        const slotWidth = w * 0.15;
        const slotHeight = h * 0.6;
        const slotY = -slotHeight / 2;

        this.ctx.fillRect(-w * 0.25, slotY, slotWidth, slotHeight);
        this.ctx.fillRect(w * 0.25 - slotWidth, slotY, slotWidth, slotHeight);

        // Chrome details
        this.ctx.fillStyle = '#e0e0e0';
        this.ctx.fillRect(-w/2 + 5, -h/2 + 5, w - 10, 8);

        // Power indicator
        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.arc(w/2 - 10, h/2 - 10, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Wings
        this.drawWings(obj, w * 0.8);

        this.ctx.restore();
    }

    drawWings(obj, wingspan) {
        const wingFlap = Math.sin(obj.wingAngle) * 0.3;

        // Left wing
        this.ctx.save();
        this.ctx.rotate(wingFlap);
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(-wingspan/2, 0, wingspan/2, wingspan/4, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Wing feathers
        this.ctx.strokeStyle = '#aaa';
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(-wingspan/2 - wingspan/6, -wingspan/8 + i * wingspan/12);
            this.ctx.lineTo(-wingspan/2 + wingspan/6, -wingspan/8 + i * wingspan/12);
            this.ctx.stroke();
        }
        this.ctx.restore();

        // Right wing
        this.ctx.save();
        this.ctx.rotate(-wingFlap);
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(wingspan/2, 0, wingspan/2, wingspan/4, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Wing feathers
        this.ctx.strokeStyle = '#aaa';
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(wingspan/2 - wingspan/6, -wingspan/8 + i * wingspan/12);
            this.ctx.lineTo(wingspan/2 + wingspan/6, -wingspan/8 + i * wingspan/12);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    drawToast(obj) {
        this.ctx.save();
        this.ctx.translate(obj.x, obj.y);
        this.ctx.rotate(obj.rotation);

        const w = obj.size;
        const h = obj.size * 1.2;

        // Toast slice
        this.ctx.fillStyle = '#d4a574';
        this.ctx.strokeStyle = '#8b6f47';
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.roundRect(-w/2, -h/2, w, h, 3);
        this.ctx.fill();
        this.ctx.stroke();

        // Toasted edges (darker brown)
        this.ctx.fillStyle = '#8b6f47';
        this.ctx.fillRect(-w/2, -h/2, w, 4);
        this.ctx.fillRect(-w/2, h/2 - 4, w, 4);

        // Butter
        this.ctx.fillStyle = 'rgba(255, 223, 0, 0.6)';
        this.ctx.beginPath();
        this.ctx.ellipse(0, -h/6, w/3, h/6, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }
}
