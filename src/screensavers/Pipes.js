import { BaseScreensaver } from '../core/BaseScreensaver.js';

/**
 * Pipes - 3D pipe building screensaver
 * Inspired by the classic Windows screensaver
 */
export class Pipes extends BaseScreensaver {
    static get metadata() {
        return {
            id: 'pipes',
            name: 'Pipes',
            description: 'Classic 3D pipe construction',
            icon: '🔧',
            author: 'After Dark Collection',
            year: 1992
        };
    }

    init() {
        this.pipes = [];
        this.maxPipes = 3;
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
        ];

        // Create initial pipes
        for (let i = 0; i < this.maxPipes; i++) {
            this.createPipe();
        }
    }

    createPipe() {
        const x = this.randomInt(5, Math.floor(this.width / 20) - 5);
        const y = this.randomInt(5, Math.floor(this.height / 20) - 5);

        this.pipes.push({
            segments: [{ x, y, z: 0 }],
            direction: this.randomInt(0, 3), // 0: right, 1: down, 2: left, 3: up
            color: this.colors[this.randomInt(0, this.colors.length - 1)],
            maxLength: this.randomInt(30, 80),
            speed: 200, // milliseconds per segment
            lastUpdate: performance.now()
        });
    }

    draw(timestamp) {
        // Semi-transparent black for fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        const cellSize = 20;

        // Update and draw pipes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];

            // Add new segment
            if (timestamp - pipe.lastUpdate > pipe.speed) {
                const last = pipe.segments[pipe.segments.length - 1];

                // Randomly change direction
                if (Math.random() < 0.2) {
                    const oldDir = pipe.direction;
                    pipe.direction = this.randomInt(0, 3);
                    // Don't go backward
                    if ((pipe.direction + 2) % 4 === oldDir) {
                        pipe.direction = oldDir;
                    }
                }

                // Calculate new position
                let newX = last.x;
                let newY = last.y;

                switch (pipe.direction) {
                    case 0: newX++; break; // right
                    case 1: newY++; break; // down
                    case 2: newX--; break; // left
                    case 3: newY--; break; // up
                }

                // Check bounds
                if (newX >= 0 && newX < this.width / cellSize &&
                    newY >= 0 && newY < this.height / cellSize) {
                    pipe.segments.push({ x: newX, y: newY, z: 0 });
                } else {
                    // Hit edge, remove pipe
                    this.pipes.splice(i, 1);
                    this.createPipe();
                    continue;
                }

                // Check max length
                if (pipe.segments.length > pipe.maxLength) {
                    this.pipes.splice(i, 1);
                    this.createPipe();
                    continue;
                }

                pipe.lastUpdate = timestamp;
            }

            // Draw pipe segments
            this.ctx.strokeStyle = pipe.color;
            this.ctx.lineWidth = cellSize * 0.6;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';

            this.ctx.beginPath();
            pipe.segments.forEach((segment, idx) => {
                const x = segment.x * cellSize + cellSize / 2;
                const y = segment.y * cellSize + cellSize / 2;

                if (idx === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            });
            this.ctx.stroke();

            // Draw joints
            this.ctx.fillStyle = pipe.color;
            pipe.segments.forEach(segment => {
                const x = segment.x * cellSize + cellSize / 2;
                const y = segment.y * cellSize + cellSize / 2;

                this.ctx.beginPath();
                this.ctx.arc(x, y, cellSize * 0.4, 0, Math.PI * 2);
                this.ctx.fill();

                // Highlight
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.beginPath();
                this.ctx.arc(x - cellSize * 0.1, y - cellSize * 0.1, cellSize * 0.15, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = pipe.color;
            });
        }
    }
}
