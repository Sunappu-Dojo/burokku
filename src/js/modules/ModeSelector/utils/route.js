/**
 * @type {Mode} DEFAULT_MODE
 */
export const DEFAULT_MODE = 'classic'

const modeRoutes = {
  classic: '/',
}

/**
 * Get route URL for the given mode.
 *
 * @param {Mode} name Mode name
 */
export const route = (name = DEFAULT_MODE) => modeRoutes[name]
