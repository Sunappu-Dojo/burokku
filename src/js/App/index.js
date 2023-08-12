import { doc }          from '../helpers/Document'
import initEvents       from '../events/EventsManager'
import { isSupported }  from '../utils/ServiceWorker/support'
import { isStandalone } from '../utils/MediaQueries'

import { Classic, Pomodoro } from '../modes'

import {
  ModeSelector,
  initBlocks, initColorSchemes, initMenu, initWallet
} from '../modules'

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

  constructor() {
    this.modes = {
      classic: Classic,
      pomodoro: Pomodoro,
    }

    this.init()
  }

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

    initEvents(this)

    this.blocks = initBlocks()
    this.wallet = initWallet()
    this.menu = initMenu(this)
    this.colorSchemes = initColorSchemes(this)

    ModeSelector.setFromUrl()
    if (!this.game) {
      this.initGame()
    }

    initServiceWorker()
  }

  initGame() {
    this.game?.destroy()
    this.game = new this.modes[ModeSelector.selected](this)
    this.game.init()
  }
}

const app = new Burokku()

export default app
