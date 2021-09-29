import Rumble from '../../helpers/Rumble'
import Setting from '.'

const rumbleId = 'rumble'
const rumbleLabelIdSelector = '#rumble-label'
const rumbleLabels = ['Enable vibrations', 'Disable vibrations']

class RumbleSetting extends Setting {
  constructor() {
    super(rumbleId, rumbleLabelIdSelector, rumbleLabels)
  }

  toggle(state = !this.enabled) {
    Rumble.toggle(state)
    super.toggle(state)
  }

  detectSupport() {
    super.detectSupport(Rumble.isSupported())
  }
}

const rumbleSetting = new RumbleSetting()

export default rumbleSetting
