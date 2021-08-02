import Sfx from '../../helpers/Sfx'

const soundBtn = document.getElementById('sound')
const soundLabelEl = soundBtn.querySelector('#sound-label')

const soundLabels = ['Unmute', 'Mute']

/**
 * Toggle the sound on (1) and off (0) so that the static Sfx class can use it.
 */
class Volume {
  #level = 1

  onTap(e) {
    if (e.composedPath().includes(soundBtn)) {
      this.toggle()
    }
  }

  toggle(level = !this.#level) {
    this.#level = Number(level)
    Sfx.setVolume(this.#level)

    // Update UI
    soundBtn.classList.toggle('sound--on', level)
    soundBtn.setAttribute('title', soundLabels[this.#level])
    soundLabelEl.innerHTML = soundLabels[this.#level]
  }
}

const volume = new Volume()

export default volume
