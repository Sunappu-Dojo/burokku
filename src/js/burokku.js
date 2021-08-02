import initBlocks from './modules/Blocks'
import initEvents from './events/index'
import initNav from './modules/Nav'
import volume from './modules/Volume'
import initWallet from './modules/Wallet'
import watchColorSchemes from './modules/ColorSchemes'

const installBtnId = 'sw-install'
const installBtnVisible = 'app-install--visible'

class Burokku {
  constructor() {
    this.doc = document.documentElement
    this.title = document.head.querySelector('title')

    this.init()
  }

  updateTitle() {
    if (this.wallet.money) {
      this.title.innerHTML = `x ${this.wallet.money} • ${this.blocks.active.btn.dataset.game}`
    }
  }

  onTap({ target }) {
    if (target.id === installBtnId) {
      this.sw.addToHome()
    }
  }

  init() {
    this.doc.classList.remove('no-js')
    this.doc.classList.add('js')

    initEvents(this)

    this.blocks = initBlocks()
    this.wallet = initWallet()
    this.nav = initNav()
    this.volume = volume

    watchColorSchemes()

    this.initServiceWorker()
  }

  initServiceWorker() {
    import(/* webpackChunkName: "modules/service-worker" */
      './modules/ServiceWorker').then(swModule => {
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
