/* TODO:
 * - split this file in several config files
 */

const webpack = require('webpack')

// env
const env = require('dotenv').config().parsed
const isProd = process.env.NODE_ENV === 'production'

// path
const path = require('path')
const thePath = (folder = '') => path.resolve(__dirname, folder)
const assets = 'src'

// plugins: folder cleaning
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// plugins: reload & cli output
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const NotifierPlugin = require('webpack-build-notifier')

// plugins: CSS & JS
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Notifications options
const NotifierPluginOptions = {
  logo: thePath('src/manifest/android-chrome-192x192.png'),
  sound: false,
  notifyOptions: { timeout: 2 },
  messageFormatter: (error, filepath) => filepath,
}

/* BrowserSync HTTPS with Laravel Valet
 *
 * BrowserSync HTTPS: https://www.browsersync.io/docs/options#option-https
 * Laravel Valet HTTPS: https://laravel.com/docs/5.7/valet#securing-sites
 */

let browserSyncHttps = false

if (
  process.env.VALET_HTTPS === 'true'
  && typeof(process.env.VALET_USER) === 'string'
  && process.env.VALET_CERTIFICATES_PATH
) {
  let certificatesPath = `/Users/${process.env.VALET_USER}/${process.env.VALET_CERTIFICATES_PATH}/${process.env.MIX_BS_LOCAL_URL.substring(8)}`

  browserSyncHttps = {
    key: `${certificatesPath}.key`,
    cert: `${certificatesPath}.crt`,
  }
}

/* JS */

configJs = {

  entry: {
    burokku: `./${assets}/js/burokku.js`,
  },

  output: {
    filename: '[name].js',
    path: thePath('public/js'),
    publicPath: '/js/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
    ]
  },

  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new NotifierPlugin({ title: 'JS', ...NotifierPluginOptions }),
  ],

  mode: process.env.NODE_ENV,

  devtool: isProd ? 'source-map' : 'cheap-eval-source-map',

  devServer: {
    quiet: true,
  },

  performance: {
    hints: false,
  },

  stats: {
    children: false,
    entrypoints: false,
    excludeAssets: /^((?!\.js$).)*$/,
    hash: false,
    modules: false,
    version: false,
  },
}

/* CSS */

configCSS = {

  entry: {
    block: `./${assets}/sass/block.scss`,
  },

  output: {
    path: thePath('public/css'),
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        include: thePath(`${assets}/sass`),
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 2, url: false, sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: {
            implementation: require('node-sass'),
            sassOptions: { outputStyle: 'expanded' },
            sourceMap: true
          }},
        ],
      },
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new CopyWebpackPlugin({ patterns: [
      { from: `${assets}/fonts/`, to: thePath('public/fonts') },
      { from: `${assets}/manifest/`, to: thePath('public') },
      { from: `${assets}/sfx/`, to: thePath('public/sfx') },
    ]}),
    // new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new NotifierPlugin({ title: 'CSS', ...NotifierPluginOptions }),
    new BrowserSyncPlugin({
      https: browserSyncHttps,
      host: process.env.MIX_BS_HOST,
      proxy: process.env.MIX_BS_LOCAL_URL,
      browser: process.env.MIX_BS_BROWSER,
      open: process.env.MIX_BS_OPEN,
      logPrefix: process.env.APP_NAME,
      files: [
        'public/**/*.*',
      ],
    }, {
      injectCss: true, // will work once PR merged: https://github.com/Va1/browser-sync-webpack-plugin/pull/79
    }),
  ],

  mode: process.env.NODE_ENV,

  devtool: isProd ? 'source-map' : 'cheap-module-source-map',

  devServer: {
    quiet: true,
  },

  performance: {
    hints: false,
  },

  stats: {
    children: false,
    entrypoints: false,
    excludeAssets: /^((?!\.css$).)*$/,
    hash: false,
    modules: false,
    version: false,
  },
}

module.exports = [configCSS, configJs]
