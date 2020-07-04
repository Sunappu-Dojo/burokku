import Events from '../events/index'
import watchColorSchemes from '../modules/ColorSchemes'
import Block from '../modules/Block'
import initNav from '../modules/Nav'

const installBtnId = 'sw-install'
const installBtnVisible = 'app-install--visible'

export default class {
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

    let events = new Events(this)
  }

  initPage() {
    this.block = new Block()
    this.nav = initNav()
    watchColorSchemes()
    this.initServiceWorker()
  }

  initServiceWorker() {
    import(/* webpackChunkName: "modules/service-worker" */
      '../modules/ServiceWorker').then(swModule => {
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
