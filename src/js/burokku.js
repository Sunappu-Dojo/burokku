import { initBlocks }       from './modules/BlocksManager'
import { initColorSchemes } from './modules/ColorSchemes'
import initEvents           from './modules/EventsManager'
import { initGame }         from './modules/Game'
import { initMenu }         from './modules/Menu'
import { initServiceWorker } from './modules/ServiceWorker'
import { initWallet }       from './modules/Wallet'
import { doc }              from './utils/Document'

doc.classList.replace('no-js', 'js')

initEvents()
initBlocks()
initWallet()
initMenu()
initGame()
initColorSchemes()
initServiceWorker()
