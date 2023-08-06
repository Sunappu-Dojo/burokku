/**
 * @type {Mode} DEFAULT_MODE
 */
export const DEFAULT_MODE = 'classic'

const modeRoutes = {
  classic: '/',
  pomodoro: '?pomodoro',
}

/**
 * Get route URL for the given mode.
 *
 * @param {Mode} name Mode name
 */
export const route = (name = DEFAULT_MODE) => modeRoutes[name]

/**
 * Is the current route for the Pomodoro mode?
 */
export const isPomodoro = () => new URL(location.href).searchParams.get('pomodoro') != null
