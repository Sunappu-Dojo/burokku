export default class ServiceWorker {
  constructor(options) {
    this.options = options
    this.defferedInstallPrompt = null

    this.init()
  }

  static isSupported = 'serviceWorker' in navigator

  install() {
    if (!navigator.serviceWorker.controller) {
      navigator.serviceWorker.register('/block-service-worker.js')
    }
  }

  // Delay “add to home screen” prompt.
  waitInstallPrompt() {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault()
      this.defferedInstallPrompt = e

      if ('initInstallPrompt' in this.options) {
        this.options.initInstallPrompt()
      }
    })
  }

  addToHome() {
    if (!this.defferedInstallPrompt) { return }

    this.defferedInstallPrompt.prompt()

    this.defferedInstallPrompt.userChoice.then(choice => {
      if (choice.outcome != 'accepted') { return }

      this.defferedInstallPrompt = null
      this.options.onInstall?.()
    })
  }

  init() {
    this.install()
    this.waitInstallPrompt()
  }
}
