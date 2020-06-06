const format = document.createElement('audio').canPlayType('audio/flac').length > 0 ? 'flac' : 'wav'

export const SOUNDS = {
  bump: '/sfx/smb-bump.' + format,
  coin: '/sfx/smb-coin.' + format,
  oneUp: '/sfx/smb-1up.' + format,
}

export const CSS = {
  btn: '⍰-ctn',
  btnInner: '⍰__inner',
  hit: '⍰--hit',
  hitAnimation: '⍰-hit',
  coins: '⍰__coin-ctn',
  flippingCoin: 'coin--flipping',
  coinsNumber: 'coins',
}

export const THROTTLE = 130
