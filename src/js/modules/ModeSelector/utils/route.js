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
 * @param {ConstructorParameters<typeof URLSearchParams>} params Search parameters
 */
export const route = (name = DEFAULT_MODE, params = undefined) => {
  const url = new URL(location.origin + modeRoutes[name])

  params = new URLSearchParams(params)
  params.forEach((value, key) => url.searchParams.set(key, value))

  return url
}

/**
 * Is the current route for the Pomodoro mode?
 */
export const isPomodoro = () => new URL(location.href).searchParams.get('pomodoro') != null
