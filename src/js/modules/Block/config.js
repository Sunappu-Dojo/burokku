const format = document.createElement('audio').canPlayType('audio/flac').length > 0 ? 'flac' : 'wav'

export const SOUNDS = {
  bump: '/sfx/smb-bump.' + format,
  coin: '/sfx/smb-coin.' + format,
  oneUp: '/sfx/smb-1up.' + format,
}

export const CSS = {
  btn: '⍰-ctn',
  hit: '⍰--hit',
  hitAnimation: '⍰-hit',
  coinsNumber: 'coins',
}
