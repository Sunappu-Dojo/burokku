import app from './App'
import initEvents from './events/EventsManager'
import { initColorSchemes } from './modules/ColorSchemes'
import { initMenu }         from './modules/Menu'
import { initWallet }       from './modules/Wallet'

initWallet()
initEvents()
initMenu()
app.init()
initColorSchemes()
