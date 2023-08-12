import { doc }          from '../helpers/Document'
import { isSupported }  from '../utils/ServiceWorker/support'
import { isStandalone } from '../utils/MediaQueries'

import { Classic, Pomodoro } from '../modes'
import { ModeSelector } from '../modules'

const modes = {
  classic: Classic,
  pomodoro: Pomodoro,
}

let installBtn = document.getElementById('sw-install')
const removeInstallButton = () => installBtn = installBtn?.remove()

/** @type {Function | undefined} addToHome Show the website “install” prompt. */
let addToHome

const initServiceWorker = () => {
  if (!isSupported) { return }

  import('../utils/ServiceWorker').then(({ register, setupAppInstall }) => {
    register('/block-service-worker.js')

    // Setup add to home screen. A `standalone` app already went there.

    if (isStandalone()) { return removeInstallButton() }

    addToHome = setupAppInstall({
      initPrompt: () => installBtn.classList.add('app-install--visible'),
      onInstall: removeInstallButton,
    })
  })
}

class Burokku {
  #game

  updateTitle() {
    document.title = this.game.getTitle()
  }

  onTap({ target }, stop) {
    if (target === installBtn) {
      addToHome()
      stop()
    }
  }

  init() {
    doc.classList.replace('no-js', 'js')

    ModeSelector.setFromUrl()
    if (!this.game) {
      this.initGame()
    }

    initServiceWorker()
  }

  initGame() {
    this.game?.destroy()
    this.game = new modes[ModeSelector.selected](this)
    this.game.init()
  }
}

const app = new Burokku()

export default app
