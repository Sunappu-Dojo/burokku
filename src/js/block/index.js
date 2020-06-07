import Events from '../events/index'
import ColorSchemes from '../modules/ColorSchemes'
import Block from '../modules/Block'

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
    this.initBlock()
    this.initColorSchemes()
    this.initServiceWorker()
  }

  initBlock() {
    this.block = new Block()
  }

  initColorSchemes() {
    this.colorSchemes = new ColorSchemes()
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
