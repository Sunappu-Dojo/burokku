class EventListenerOptionsSupport {
  constructor() {
    this.supportedOptions = {}

    this.init()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
  testEventListenerOption(option) {
    let supported = false
    let options = Object.defineProperty({}, option, {
      get: () => {
        supported = true
      },
    })

    try {
      window.addEventListener('test', options, options)
      window.removeEventListener('test', options, options)
    } catch (err) {
      supported = false
    }
    this.supportedOptions[option] = supported
  }

  options({ capture = false, passive = true, once = false } = {}) {
    return this.supportedOptions.capture
      ? { capture: capture, passive: passive, once: once }
      : capture
  }

  init() {
    this.testEventListenerOption('passive')
    this.testEventListenerOption('capture')
    return this.supportedOptions
  }
}

const optionsSupport = new EventListenerOptionsSupport()

export const support = optionsSupport.supportedOptions
export const activeEvent = optionsSupport.options({ passive: false })
export const passiveEvent = optionsSupport.options()
export const captureEvent = optionsSupport.options({
  capture: true,
  passive: false,
})
