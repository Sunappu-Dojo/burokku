import { doc }    from './helpers/Document'
import initEvents from './events/EventsManager'

import { Classic } from './modes'

import {
  ModeSelector,
  initBlocks, initColorSchemes, initMenu, initWallet,
  rumble, volume, // settings
}                 from './modules'

const installBtnId = 'sw-install'
const installBtnVisible = 'app-install--visible'

class Burokku {
  #game

  constructor() {
    this.modes = {
      classic: Classic,
    }

    this.init()
  }

  updateTitle() {
    this.game.updateTitle()
  }

  onTap({ target }, stop) {
    if (target.id === installBtnId) {
      this.sw?.addToHome()
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
    this.settings = { rumble, volume }

    ModeSelector.setFromUrl()
    if (!this.game) {
      this.initGame()
    }

    this.initServiceWorker()
  }

  initGame() {
    this.game?.destroy()
    this.game = new this.modes[ModeSelector.selected](this)
    this.game.init()
  }

  initServiceWorker() {
    import('./modules/ServiceWorker').then(swModule => {
      const SW = swModule.default

      if (SW.getSupport()) {
        const installBtn = document.getElementById(installBtnId)

        this.sw = new SW({
          installBtnId,
          initInstallPrompt: () => installBtn.classList.add(installBtnVisible),
          onInstall: () => installBtn.classList.remove(installBtnVisible),
        })
      }
    })
  }
}

new Burokku()
