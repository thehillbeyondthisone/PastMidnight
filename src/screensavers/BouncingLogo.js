import { BaseScreensaver } from '../core/BaseScreensaver.js';

/**
 * Bouncing Logo - DVD-style bouncing logo
 * The logo bounces around and changes color when hitting edges
 */
export class BouncingLogo extends BaseScreensaver {
    static get metadata() {
        return {
            id: 'bouncing-logo',
            name: 'Bouncing Logo',
            description: 'Classic bouncing logo that changes color on impact',
            icon: '📀',
            author: 'After Dark Collection',
            year: 1995
        };
    }

    init() {
        this.logoWidth = 200;
        this.logoHeight = 100;
        this.x = this.random(0, this.width - this.logoWidth);
        this.y = this.random(0, this.height - this.logoHeight);
        this.vx = 2;
        this.vy = 2;
        this.color = this.randomColor();
        this.cornerHits = 0;
    }

    draw(timestamp) {
        // Clear with black
        this.fillBackground('#000');

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        let hitCorner = false;
        let hitEdge = false;

        // Check collision with edges
        if (this.x <= 0 || this.x + this.logoWidth >= this.width) {
            this.vx *= -1;
            this.x = Math.max(0, Math.min(this.width - this.logoWidth, this.x));
            hitEdge = true;
        }

        if (this.y <= 0 || this.y + this.logoHeight >= this.height) {
            this.vy *= -1;
            this.y = Math.max(0, Math.min(this.height - this.logoHeight, this.y));
            hitEdge = true;
        }

        // Check for corner hit (the legendary moment!)
        if ((this.x <= 0 || this.x + this.logoWidth >= this.width) &&
            (this.y <= 0 || this.y + this.logoHeight >= this.height)) {
            hitCorner = true;
            this.cornerHits++;
        }

        // Change color on edge hit
        if (hitEdge) {
            this.color = this.randomColor();
        }

        // Draw logo
        this.drawLogo();

        // Show corner hits counter
        if (this.cornerHits > 0) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px monospace';
            this.ctx.fillText(`Corner Hits: ${this.cornerHits}`, 10, 30);

            if (hitCorner) {
                this.ctx.font = 'bold 30px monospace';
                this.ctx.fillStyle = '#ffff00';
                this.ctx.fillText('🎉 CORNER HIT! 🎉', this.width / 2 - 150, this.height / 2);
            }
        }
    }

    drawLogo() {
        this.ctx.save();
        this.ctx.translate(this.x + this.logoWidth / 2, this.y + this.logoHeight / 2);

        // Draw "PAST MIDNIGHT" text logo
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;

        // Background rectangle
        this.ctx.fillRect(-this.logoWidth / 2, -this.logoHeight / 2, this.logoWidth, this.logoHeight);

        // Border
        this.ctx.strokeRect(-this.logoWidth / 2, -this.logoHeight / 2, this.logoWidth, this.logoHeight);

        // Text
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 24px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('PAST', 0, -15);
        this.ctx.fillText('MIDNIGHT', 0, 15);

        // Moon emoji
        this.ctx.font = '30px sans-serif';
        this.ctx.fillText('🌙', 0, -45);

        this.ctx.restore();
    }

    resizeCanvas() {
        super.resizeCanvas();
        // Keep logo in bounds after resize
        this.x = Math.min(this.x, this.width - this.logoWidth);
        this.y = Math.min(this.y, this.height - this.logoHeight);
    }
}
