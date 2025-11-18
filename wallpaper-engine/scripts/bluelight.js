'use strict';

/**
 * Blue Light Filter Script
 * Adjusts the warm overlay based on user settings
 */

let filterEnabled = true;
let filterIntensity = 50;

/**
 * @param {Number} value - Current alpha value
 * @return {Number} - Updated alpha value
 */
export function update(value) {
    if (!filterEnabled) {
        return 0;
    }

    // Convert intensity (0-100) to alpha (0-0.6)
    // Max alpha of 0.6 to avoid making screen too orange
    const targetAlpha = (filterIntensity / 100) * 0.6;

    // Smooth transition
    const smoothing = 0.05;
    const newValue = value + (targetAlpha - value) * smoothing;

    return newValue;
}

/**
 * @param {Vec3} value - Current color value
 * @return {Vec3} - Updated color value
 */
export function updateColor(value) {
    if (!filterEnabled) {
        return value;
    }

    // Warm amber color for blue light filtering
    // Reduces blue component while maintaining warm tones
    const warmColor = {
        r: 1.0,
        g: 0.7 + (filterIntensity / 100) * 0.1, // Slightly more green at higher intensities
        b: 0.3 - (filterIntensity / 100) * 0.1  // Less blue at higher intensities
    };

    return `${warmColor.r} ${warmColor.g} ${warmColor.b}`;
}

/**
 * Initialize the filter
 */
export function init(value) {
    return filterEnabled ? (filterIntensity / 100) * 0.6 : 0;
}

/**
 * Handle user property changes
 */
export function applyUserProperties(properties) {
    if (properties.enablebluelight !== undefined) {
        filterEnabled = properties.enablebluelight;
    }
    if (properties.bluelightintensity !== undefined) {
        filterIntensity = properties.bluelightintensity;
    }
}
