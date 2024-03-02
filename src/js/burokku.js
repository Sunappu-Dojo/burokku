import { initBlocks }       from './modules/BlocksManager'
import { initColorSchemes } from './modules/ColorSchemes'
import initEvents           from './modules/EventsManager'
import { initGame }         from './modules/Game'
import { initServiceWorker } from './modules/ServiceWorker'
import { initWallet }       from './modules/Wallet'
import { doc }              from './utils/Document'

doc.classList.replace('no-js', 'js')

/** @type {import('./modules/Menu/Menu').Menu} */
let menu = null
export const getMenu = () => menu

initEvents()
initBlocks()
const wallet = initWallet()
import('./modules/Menu').then(({ Menu }) => menu ??= new Menu({ show: () => wallet.coins }))
initGame()
initColorSchemes()
initServiceWorker()
