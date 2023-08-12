/**
 * Creates an event listener options object with. Doesn’t support `signal`.
 *
 * @param {AddEventListenerOptions}
 */
const createEventListenerOptions = ({ capture = false, passive = true, once = false } = {}) =>
  ({ capture, passive, once })

export default createEventListenerOptions
