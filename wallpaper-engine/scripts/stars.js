'use strict';

/**
 * Stars Particle Script
 * Controls star visibility and twinkling based on time and settings
 */

let starCount = 100;
let timeMode = 'auto';
let particleAlpha = 1.0;

/**
 * @param {Number} value - Current particle rate
 * @return {Number} - Updated particle rate
 */
export function update(value) {
    const date = new Date();
    const hours = date.getHours();

    // Calculate target star visibility
    let visibility = 1.0;

    if (timeMode === 'auto') {
        if (hours >= 20 || hours < 6) {
            // Full stars at night
            visibility = 1.0;
        } else if (hours >= 6 && hours < 8) {
            // Fade out in morning
            visibility = (8 - hours) / 2;
        } else if (hours >= 18 && hours < 20) {
            // Fade in at dusk
            visibility = (hours - 18) / 2;
        } else {
            // Almost no stars during day
            visibility = 0.1;
        }
    } else if (timeMode === 'night' || timeMode === 'midnight') {
        visibility = 1.0;
    } else if (timeMode === 'dusk') {
        visibility = 0.6;
    }

    // Apply star count multiplier
    const targetRate = (starCount / 100) * visibility;

    // Smooth transition
    const smoothing = 0.03;
    particleAlpha = particleAlpha + (visibility - particleAlpha) * smoothing;

    return targetRate;
}

/**
 * @param {Number} value - Current alpha
 * @return {Number} - Updated alpha
 */
export function updateAlpha(value) {
    return particleAlpha;
}

/**
 * Initialize stars
 */
export function init(value) {
    const date = new Date();
    const hours = date.getHours();

    if (timeMode === 'auto' && hours >= 20 || hours < 6) {
        return starCount / 100;
    }

    return timeMode === 'night' || timeMode === 'midnight' ? starCount / 100 : 0.1;
}

/**
 * Handle user property changes
 */
export function applyUserProperties(properties) {
    if (properties.starcount !== undefined) {
        starCount = properties.starcount;
    }
    if (properties.timeofday) {
        timeMode = properties.timeofday;
    }
}
