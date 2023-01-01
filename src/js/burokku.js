import { doc }                  from './helpers/Document'
import initEvents               from './events/EventsManager'

import {
  initBlocks, initWallet,
  rumble, volume,
  watchColorSchemes
}                               from './modules'

const installBtnId = 'sw-install'
const installBtnVisible = 'app-install--visible'

class Burokku {
  constructor() {
    this.init()
  }

  updateTitle() {
    if (this.wallet.money) {
      document.title = `x ${this.wallet.money} • ${this.blocks.active.btn.dataset.game}`
    }
  }

  onTap({ target }) {
    if (target.id === installBtnId) {
      this.sw.addToHome()
    }
  }

  init() {
    doc.classList.replace('no-js', 'js')

    initEvents(this)

    this.blocks = initBlocks()
    this.wallet = initWallet()
    this.settings = { rumble, volume }

    watchColorSchemes()

    this.initServiceWorker()
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
