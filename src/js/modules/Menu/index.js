/** @type {import('./Menu').Menu} */
let menu

export const getMenu = () => menu

export const initMenu = (options = {}) => import('./Menu')
  .then(({ Menu }) => menu ??= new Menu(options))
