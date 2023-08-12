import Sfx from '../../utils/Sfx'
import Setting from '.'

const soundBtnId = 'sound'
const soundLabelIdSelector = '#sound-label'
const soundLabels = ['Unmute', 'Mute']

/**
 * Toggle the sound on (1) and off (0) so that the static Sfx class can use it.
 */
class VolumeSetting extends Setting {
  #level = 1

  constructor() {
    super(soundBtnId, soundLabelIdSelector, soundLabels)
  }

  toggle(level = !this.#level) {
    this.#level = Number(level)
    Sfx.setVolume(this.#level)

    super.toggle(level)
  }
}

const volumeSetting = new VolumeSetting()

export default volumeSetting
