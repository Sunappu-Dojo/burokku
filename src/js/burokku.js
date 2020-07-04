import initEvents from './events/index'
import watchColorSchemes from './modules/ColorSchemes'
import initBlocks from './modules/Blocks'
import initNav from './modules/Nav'

const installBtnId = 'sw-install'
const installBtnVisible = 'app-install--visible'

class Burokku {
  constructor() {
    this.doc = document.documentElement

    this.init()
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
    this.nav = initNav()

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
          installBtnId: installBtnId,
          initInstallPrompt: () => installBtn.classList.add(installBtnVisible),
          onInstall: () => installBtn.classList.remove(installBtnVisible),
        })
      }
    })
  }
}

new Burokku()
