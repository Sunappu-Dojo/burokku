/**
 * Make sure a number stays between boundaries.
 *
 * Examples:
 * - clamp(17, 3, 8)  // 8
 * - clamp(-3, 3, 8)  // 3
 * - clamp(5, 3, 8)   // 5
 *
 * @param {number} val The number you want to maintain inside boundaries.
 * @param {number} min The lowest allowed value.
 * @param {number} max The highest allowed value.
 * @returns {number}
 */
export const clamp = (val, min, max) => Math.max(min, Math.min(max, val))
