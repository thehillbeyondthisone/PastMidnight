'use strict';

/**
 * Moon Script
 * Animates the moon position and brightness based on time of day
 */

let moonEnabled = true;
let moonBrightness = 70;
let timeMode = 'auto';

/**
 * @param {Number} value - Current alpha value
 * @return {Number} - Updated alpha value
 */
export function update(value) {
    if (!moonEnabled) {
        return 0;
    }

    const date = new Date();
    const hours = date.getHours();
    let targetAlpha = moonBrightness / 100;

    if (timeMode === 'auto') {
        // Moon is brighter at night (8 PM to 6 AM)
        if (hours >= 20 || hours < 6) {
            targetAlpha *= 1.0; // Full brightness
        } else if (hours >= 6 && hours < 8) {
            // Fade out in morning (6-8 AM)
            targetAlpha *= (8 - hours) / 2;
        } else if (hours >= 18 && hours < 20) {
            // Fade in at dusk (6-8 PM)
            targetAlpha *= (hours - 18) / 2;
        } else {
            targetAlpha *= 0.2; // Very dim during day
        }
    } else if (timeMode === 'night' || timeMode === 'midnight') {
        targetAlpha *= 1.0;
    } else if (timeMode === 'dusk') {
        targetAlpha *= 0.7;
    }

    // Smooth transition
    const smoothing = 0.02;
    return value + (targetAlpha - value) * smoothing;
}

/**
 * @param {Vec3} value - Current position
 * @return {Vec3} - Updated position
 */
export function updateOrigin(value) {
    if (!moonEnabled) {
        return value;
    }

    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Calculate time as decimal (0-24)
    const time = hours + (minutes / 60);

    // Moon arc across the sky (right to left, 8 PM to 6 AM)
    let x = 600;
    let y = 400;

    if (timeMode === 'auto') {
        // Night is from 20:00 to 06:00 (10 hour span)
        if (hours >= 20 || hours < 6) {
            const nightTime = hours >= 20 ? time - 20 : time + 4;
            const progress = nightTime / 10; // 0 to 1 across the night

            // Arc across sky
            x = 900 - (progress * 1800); // Right to left
            y = 300 + Math.sin(progress * Math.PI) * 300; // Arc up and down
        } else {
            // During day, moon is below horizon or barely visible
            y = -200;
        }
    } else {
        // For manual modes, position in center-right
        x = 600;
        y = 400;
    }

    return `${x} ${y} -3`;
}

/**
 * Initialize the moon
 */
export function init(value) {
    return moonEnabled ? moonBrightness / 100 : 0;
}

/**
 * Handle user property changes
 */
export function applyUserProperties(properties) {
    if (properties.enablemoon !== undefined) {
        moonEnabled = properties.enablemoon;
    }
    if (properties.moonbrightness !== undefined) {
        moonBrightness = properties.moonbrightness;
    }
    if (properties.timeofday) {
        timeMode = properties.timeofday;
    }
}
