import { isSupported }  from '../utils/ServiceWorker/support'
import { isStandalone } from '../utils/MediaQueries'

let installBtn = document.getElementById('sw-install')
const removeInstallButton = () => installBtn = installBtn?.remove()

/** @type {Function | undefined} addToHome Show the website “install” prompt. */
let addToHome

export const initServiceWorker = () => {
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

export const serviceWorkerHandlers = {
  onTap: ({ target }, stop) => {
    if (target === installBtn) {
      addToHome()
      stop()
    }
  }
}
