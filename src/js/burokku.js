import initEvents           from './events/EventsManager'
import { doc }              from './helpers/Document'
import { ModeSelector }     from './modules'
import { initBlocks }       from './modules/BlocksManager'
import { initColorSchemes } from './modules/ColorSchemes'
import { initGame }         from './modules/Game'
import { initMenu }         from './modules/Menu'
import { initServiceWorker } from './modules/ServiceWorker'
import { initWallet }       from './modules/Wallet'

doc.classList.replace('no-js', 'js')

initBlocks()
initWallet()
initEvents()
initMenu()
initGame()
ModeSelector.setFromUrl()
initColorSchemes()
initServiceWorker()
