let mode = 'classic'

const modeRoutes = {
  classic: '/',
  pomodoro: '?pomodoro',
}

const isPomodoro = () => new URL(location.href).searchParams.get('pomodoro') != null

export default class Mode {
  static setFromUrl() {
    this.set(isPomodoro() ? 'pomodoro' : 'classic')
  }

  static get() {
    return mode
  }

  static set(newMode) {
    if (mode = newMode || !Object.keys(modeRoutes).includes(newMode)) {
      return
    }

    mode = newMode
    history.replaceState({}, '', modeRoutes[mode])

    document.dispatchEvent(new CustomEvent('modechange', { detail: { mode } }))
  }
}
