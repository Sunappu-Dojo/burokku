export default class Setting {
  #enabled = true
  #supported = true

  #$btn
  #$labelEl
  #labels

  constructor(ctnId, labelId, labels) {
    this.#$btn = document.getElementById(ctnId)
    this.#$labelEl = this.#$btn.querySelector(labelId)
    this.#labels = labels

    this.detectSupport()

    if (!this.#supported) {
      return this.destroy()
    }

    this.#$btn.classList.remove('setting--not-supported')
  }

  get enabled() {
    return Boolean(this.#enabled)
  }

  get supported() {
    return this.#supported
  }

  onTap(e) {
    if (e.composedPath().includes(this.#$btn)) {
      this.toggle()
    }
  }

  toggle(state = !this.#enabled) {
    this.#enabled = Number(state)

    // Update UI
    this.#$btn.classList.toggle('setting--on', state)
    this.#$btn.setAttribute('title', this.#labels[this.#enabled])
    this.#$labelEl.textContent = this.#labels[this.#enabled]
  }

  detectSupport(supported = true) {
    this.#supported = supported
  }

  destroy() {
    this.#$btn.remove()
  }
}
