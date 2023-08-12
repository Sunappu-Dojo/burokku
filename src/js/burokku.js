import app from './App'
import { initColorSchemes } from './modules/ColorSchemes'
import { initMenu } from './modules/Menu'

app.init()
initMenu(app)
initColorSchemes()
