import Rumble from '../../utils/Rumble'
import Setting from './base-class'

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
    super.detectSupport(Rumble.supported)
  }
}

const rumbleSetting = new RumbleSetting()

export default rumbleSetting
