'use strict';

/**
 * Clock Script - Displays current time
 * Updates the text to show current system time
 */

let timeFormat = '12hr';
let showSeconds = true;

/**
 * @param {String} value - Current text value
 * @return {String} - Updated time string
 */
export function update(value) {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    let period = '';

    if (timeFormat === '12hr') {
        period = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
    }

    // Pad with zeros
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    let timeStr = `${hoursStr}:${minutesStr}`;

    if (showSeconds) {
        timeStr += `:${secondsStr}`;
    }

    timeStr += period;

    return timeStr;
}

/**
 * Initialize the clock
 */
export function init(value) {
    return update(value);
}

/**
 * Handle user property changes
 */
export function applyUserProperties(properties) {
    if (properties.timeformat) {
        timeFormat = properties.timeformat;
    }
    if (properties.showseconds !== undefined) {
        showSeconds = properties.showseconds;
    }
}
