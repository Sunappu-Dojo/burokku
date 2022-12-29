let mode = 'classic'

const modeRoutes = {
  classic: '/',
  pomodoro: '?pomodoro',
}

const route = (name = mode) => modeRoutes[name]

const toggleBtn = document.getElementById('mode')

const isPomodoro = () => new URL(location.href).searchParams.get('pomodoro') != null

export default class Mode {
  static onTap(e) {
    if (e.target == toggleBtn) {
      this.set(!isPomodoro() ? 'pomodoro' : 'classic')

      // After the first interaction with the button, make it less prominent.
      toggleBtn.classList.replace('cta--hollow', 'cta--on-hover')
    }
  }

  static setFromUrl() {
    this.set(isPomodoro() ? 'pomodoro' : 'classic')
  }

  static get() {
    return mode
  }

  static set(newMode) {
    if (mode == newMode || !route(newMode)) { return }

    document.documentElement.classList.replace(`mode-${mode}`, `mode-${newMode}`)
    mode = newMode
    toggleBtn.innerHTML = mode
    history.replaceState({}, '', route(mode))

    document.dispatchEvent(new CustomEvent('modechange', { detail: { mode } }))
  }
}
