import app from './App'
import { initColorSchemes } from './modules/ColorSchemes'
import { initMenu } from './modules/Menu'
import { initWallet } from './modules/Wallet'

initWallet()
app.init()
initMenu(app)
initColorSchemes()
