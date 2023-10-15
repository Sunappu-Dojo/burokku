import postcssPresetEnv from 'postcss-preset-env'
import postcssShortSize from 'postcss-short-size'
import cssNano from 'cssnano'
import purgecss from '@fullhuman/postcss-purgecss'

const postcssPresetEnvOptions = {
  stage: 0,
  features: {
    // https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/src/plugins/plugins-by-id.mjs
    'all-property': false,
    'color-functional-notation': false,

    // https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nested-calc#options
    'nested-calc': { preserve: false },
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

export default ({ options, env }) => ({
  plugins: [
    postcssShortSize(),
    postcssPresetEnv(postcssPresetEnvOptions),
    env === 'production' ? cssNano(cssNanoOptions) : false,
    env === 'production' ? purgecss(purgeCssOptions) : false,
  ],
})
