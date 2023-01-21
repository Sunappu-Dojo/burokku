/**
 * The minimum delay between two block bumps, in milliseconds.
 */
export const THROTTLE = 130

export const CSS = {
  btn: '⍰-ctn',
  btnInner: '⍰__inner',
  hit: '⍰--hit',
  coins: '⍰__coin-ctn',
  flippingCoin: 'coin--flipping',
}

// Sounds sets.

const format = document.createElement('audio').canPlayType('audio/flac').length > 0 ? 'flac' : 'wav'

const SOUND_LIBRARY = {
  smb: {
    bump: '/sfx/smb-bump.' + format,
    coin: '/sfx/smb-coin.' + format,
    oneUp: '/sfx/smb-1up.' + format,
  },
  smw: {
    bump: '/sfx/smw-bump.' + format,
    coin: '/sfx/smw-coin.' + format,
    oneUp: '/sfx/smw-1up.' + format,
  },
}

// Super Mario Bros. (NES) and Super Mario Bros. 3 (NES) use the same sounds.
SOUND_LIBRARY.smb3 = SOUND_LIBRARY.smb

export let SOUNDS = SOUND_LIBRARY.smb

export function useSounds(game) {
  SOUNDS = SOUND_LIBRARY[game]
}
