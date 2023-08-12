import app                  from './App'
import initEvents           from './events/EventsManager'
import { initBlocks }       from './modules/BlocksManager'
import { initColorSchemes } from './modules/ColorSchemes'
import { initMenu }         from './modules/Menu'
import { initWallet }       from './modules/Wallet'

initBlocks()
initWallet()
initEvents()
initMenu()
app.init()
initColorSchemes()
