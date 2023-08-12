import initEvents           from './events/EventsManager'
import { doc }              from './utils/Document'
import { ModeSelector }     from './modules'
import { initBlocks }       from './modules/BlocksManager'
import { initColorSchemes } from './modules/ColorSchemes'
import { initGame }         from './modules/Game'
import { initMenu }         from './modules/Menu'
import { initServiceWorker } from './modules/ServiceWorker'
import { initWallet }       from './modules/Wallet'

doc.classList.replace('no-js', 'js')

initEvents()
initBlocks()
initWallet()
initMenu()
initGame()
ModeSelector.setFromUrl()
initColorSchemes()
initServiceWorker()
