const postcssPresetEnv = require('postcss-preset-env')
const postcssShortSize = require('postcss-short-size')
const cssNano = require('cssnano')
const purgecss = require('@fullhuman/postcss-purgecss')

const postcssPresetEnvOptions = {
  stage: 0,
  features: {
    // https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/src/plugins/plugins-by-id.mjs
    'all-property': false,
    'color-functional-notation': false,
    'focus-within-pseudo-class': false,
    'focus-visible-pseudo-class': false,
    'logical-properties-and-values': { dir: 'ltr' },

    // https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nested-calc#options
    'nested-calc': { preserve: false },
    'prefers-color-scheme-query': false,
  },
}

const cssNanoOptions = { preset: ['default', { colormin: false }] }

const purgeCssOptions = {
  content: [
    './src/index.html',
    './src/js/**/*.js',
  ],
  safelist: [/⍰/],
}

module.exports = ({ options, env }) => ({
  plugins: [
    postcssShortSize(),
    postcssPresetEnv(postcssPresetEnvOptions),
    env === 'production' ? cssNano(cssNanoOptions) : false,
    env === 'production' ? purgecss(purgeCssOptions) : false,
  ],
})
