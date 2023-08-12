/**
 * Listen to `beforeinstallprompt` and configure prompt and installation callbacks.
 *
 * @param {AppInstallOptions} options
 * @returns {Function} A function that you can store to later prompt the user for website installation.
 */
export const setupAppInstall = ({ initPrompt, onInstall }) => {
  waitInstallPrompt(initPrompt)

  window.addEventListener('appinstalled', onInstall, { once: true })

  return () => promptForInstall(onInstall)
}

/**
 * Listen to `beforeinstallprompt` (“add to home screen”) and save it for later.
 *
 * @param {Function|undefined} callback Runs after `beforeinstallprompt` is deferred.
 */
const waitInstallPrompt = (callback = undefined) => {

  // define listener callback
  /**
   * @param {BeforeInstallPromptEvent} e
   */
  beforeInstallPromptCallback = e => {
    e.preventDefault()
    defferedInstallPrompt = e // save install prompt for later
    callback?.()
  }

  window.addEventListener('beforeinstallprompt', beforeInstallPromptCallback)
}

/**
 * Prompt the user for website installation.
 *
 * @param {Function | undefined} callback Runs once the install prompt is accepted.
 */
const promptForInstall = (callback = undefined) => {
  if (!defferedInstallPrompt) { return }

  // prompt
  defferedInstallPrompt.prompt()

  // wait for user choice
  defferedInstallPrompt.userChoice.then(({ outcome }) => {
    if (outcome != 'accepted') { return }

    defferedInstallPrompt = null
    window.removeEventListener('beforeinstallprompt', beforeInstallPromptCallback)
    callback?.()
  })
}

/** @type {BeforeInstallPromptEvent | undefined} */
let defferedInstallPrompt

/** @type {Function | undefined} beforeInstallPromptCallback Holds the listener callback, for later listener removal convenience. */
let beforeInstallPromptCallback
