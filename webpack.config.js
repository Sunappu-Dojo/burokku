// env
const env = require('dotenv').config().parsed
const isProd = process.env.NODE_ENV === 'production'
const mode = isProd ? 'production' : 'development'

// path
const path = require('path')
const thePath = (folder = '') => path.resolve(__dirname, folder)
const assets = 'src'

// plugins: folder cleaning
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

// plugins: reload & cli output
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const FriendlyErrorsPlugin = require('@soda/friendly-errors-webpack-plugin')
const NotifierPlugin = require('webpack-build-notifier')

// plugins: CSS & JS
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const EsLintPlugin = require('eslint-webpack-plugin');

// Notifications options
const notifierPluginOptions = {
  logo: thePath('src/manifest/android-chrome-192x192.png'),
  sound: false,
  notifyOptions: { timeout: 2 },

  // Errors/warnings format. Example: “3 errors – resources/sass/oh-no.scss”
  messageFormatter: (error, filepath, status, errorCount) => `
    ${errorCount} ${status}${errorCount === 1 ? '' : 's'} – ${filepath.replace(thePath() + '/', '')}`,
}

// ESLint Options
const esLintPluginOptions = {
  fix: env.ES_LINT_AUTOFIX == 'true',
  formatter: env.ES_LINT_FORMATTER,
}

/* BrowserSync HTTPS with Laravel Valet
 *
 * BrowserSync HTTPS: https://www.browsersync.io/docs/options#option-https
 * Laravel Valet HTTPS: https://laravel.com/docs/5.7/valet#securing-sites
 */

let browserSyncHttps = false

if (
  env.VALET_HTTPS === 'true'
  && typeof(env.VALET_USER) === 'string'
  && env.VALET_CERTIFICATES_PATH
) {
  let certificatesPath = `/Users/${env.VALET_USER}/${env.VALET_CERTIFICATES_PATH}/${env.MIX_BS_LOCAL_URL.substring(8)}`

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
    filename: '[name].js?id=[contenthash]',
    path: thePath('public/js'),
    publicPath: '/js/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ]
  },

  optimization: {
    minimize: isProd,

    /**
     * For now, we’ll don’t let Webpack automatically split chunks
     * (https://webpack.js.org/plugins/split-chunks-plugin/#defaults).
     *
     * Instead, dynamic import is used. We’ll see later if should be
     * reconsidered or not. See also:
     * https://blog.logrocket.com/guide-performance-optimization-webpack/
     */
    splitChunks: false,
  },

  plugins: [
    new EsLintPlugin(esLintPluginOptions),
    new FriendlyErrorsPlugin(),
    new NotifierPlugin({ title: 'JS', ...notifierPluginOptions }),
  ],

  mode,

  devtool: isProd ? 'source-map' : 'eval-cheap-source-map',

  devServer: {
    quiet: true,
  },

  performance: {
    hints: false,
  },

  stats: {
    modules: false,
    version: false,
    // excludeAssets: [
    //   /.*\.(ico|jpg|png|svg|webmanifest|xml)$/, // Web Manifest and icons
    //   /.*\.map$/, // Sourcemaps
    // ],
  },
}

/* CSS */

configCSS = {

  entry: {
    block: `./${assets}/sass/block.scss`,
  },

  output: {
    path: thePath('public/css'),
    publicPath: '/css/', // currently required (https://github.com/shellscape/webpack-manifest-plugin/issues/229)
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
      // {
      //   test: /\.(jpg|png)$/,
      //   include: thePath(`${assets}/img`),
      //   type: 'asset/resource',
      // },
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css?id=[fullhash]' }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!index.html'],
    }),
    new FriendlyErrorsPlugin(),
    new NotifierPlugin({ title: 'CSS', ...notifierPluginOptions }),
  ],

  mode,

  devtool: isProd ? 'source-map' : 'cheap-module-source-map',

  devServer: {
    quiet: true,
  },

  performance: {
    hints: false,
  },

  stats: {
    entrypoints: false,
    excludeAssets: [
      /.*\.(ico|jpg|png|svg|webmanifest|xml)$/, // Web Manifest and icons
      /.*\.woff2/, // fonts
      /.*\.js/, // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/85
    ],
    modules: false,
    version: false,
  },
}

/* Others without entry point, so we push them to the previous config. */

configCSS.plugins.push(
  new CopyPlugin({ patterns: [
      { from: `${assets}/fonts/`, to: thePath('public/fonts') },
      { from: `${assets}/manifest/`, to: thePath('public') },
      { from: `${assets}/sfx/`, to: thePath('public/sfx') },
  ]}),
  new BrowserSyncPlugin({
    https: browserSyncHttps,
    host: env.MIX_BS_HOST,
    proxy: env.MIX_BS_LOCAL_URL,
    browser: env.MIX_BS_BROWSER,
    open: env.MIX_BS_OPEN,
    logPrefix: env.APP_NAME,
    files: [
      'public/**/*.*',
      'src/**/*.*',
    ],
  }, {
    injectCss: true, // should work once PR merged: https://github.com/Va1/browser-sync-webpack-plugin/pull/79
  }),
)

module.exports = [configCSS, configJs]
