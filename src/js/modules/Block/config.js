/**
 * The minimum delay between two block bumps, in milliseconds.
 */
export const THROTTLE = 130

export const CSS = Object.freeze({
  btn: '⍰-ctn',
  btnInner: '⍰__inner',
  hit: '⍰--hit',
  hitAnimation: '⍰-hit',
  coins: '⍰__coin-ctn',
  flippingCoin: 'coin--flipping',
})

// Sounds sets.

const format = document.createElement('audio').canPlayType('audio/flac').length > 0 ? 'flac' : 'wav'

const SOUND_LIBRARY = {
  smb: Object.freeze({
    bump: '/sfx/smb-bump.' + format,
    coin: '/sfx/smb-coin.' + format,
    oneUp: '/sfx/smb-1up.' + format,
  }),
  smb3: Object.freeze({
    bump: '/sfx/smb-bump.' + format,
    coin: '/sfx/smb-coin.' + format,
    oneUp: '/sfx/smb-1up.' + format,
  }),
  smw: Object.freeze({
    bump: '/sfx/smw-bump.' + format,
    coin: '/sfx/smw-coin.' + format,
    oneUp: '/sfx/smw-1up.' + format,
  }),
}

export let SOUNDS = SOUND_LIBRARY.smb

export function useSounds(game) {
  SOUNDS = SOUND_LIBRARY[game]
}
