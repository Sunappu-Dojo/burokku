import { defineConfig } from 'vite'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteSingleFile } from 'vite-plugin-singlefile'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import eslintPlugin from 'vite-plugin-eslint'

/**
 * Parses .env file, using `dotenv`.
 *
 * We could use `loadEnv` (from 'vite'), but it exposes too much system values.
 * Despite being used by vite under the hood, `dotenv` is among the project
 * dev dependencies due to a version difference: Vite sticks to v14.3.2
 * while the project uses v16.x.
 *
 * https://github.com/vitejs/vite/blob/main/packages/vite/package.json#L91
 * https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md
 */
const env = require('dotenv').config().parsed
const isProd = env?.NODE_ENV === 'production'

let outDir = env?.APP_BUILD_DIR || 'public'

// Prevents to output app files outside of the project root.
if (outDir.includes('../')) {
  throw new Error('APP_BUILD_DIR (in the .env file) can’t be outside of the app root directory. Remove all `../` from `APP_BUILD_DIR`.')
}

// ESLint Options
const esLintOptions = {
  cache: false, // cache is cleaned on `npm install`
  cacheStrategy: 'content',
  fix: env?.ES_LINT_AUTOFIX == 'true',
  formatter: env?.ES_LINT_FORMATTER ?? 'stylish',
}

// HTML plugin option (https://github.com/vbenjs/vite-plugin-html#parameter-description)
const htmlOptions = {
  minify: {
    collapseWhitespace: true,
    keepClosingSlash: false,
    removeComments: true,
  },
}

// Inline assets (https://github.com/richardtallent/vite-plugin-singlefile#config)
const singleFileOptions = {
  useRecommendedBuildConfig: false,
  inlinePattern: [
    'js/helpers/Storage/idbDetect.js',
  ],
}

export default defineConfig({
  root: 'src',

  build: {
    envDir: './',
    outDir: `../${outDir}`,
    emptyOutDir: true,
    cssCodeSplit: false, // might be reconsidered when app evolves
    target: browserslistToEsbuild(),
    modulePreload: {
      polyfill: false,
    },
    define: {
      idbAvailable: 'idbAvailable',
      idbAvailabilityDetected: 'idbAvailabilityDetected',
    },
    rollupOptions: {
      input: {
        'js/burokku': resolve('./src/index.html'),
        'js/helpers/Storage/idbDetect': resolve('./src/js/helpers/Storage/idbDetect.js'),
        'js/utils/ServiceWorker': resolve('./src/js/utils/ServiceWorker/index.js'),
        'block-service-worker': resolve('./src/js/service-worker.js'),
      },
      output: {
        // Preserve filenames, needed for Service Worker.
        entryFileNames: '[name].js', // JS entries
        chunkFileNames: 'js/modules/[name].js', // dynamic imports
        assetFileNames: 'css/block.css', // other files (CSS only for now)

        /**
         * Prevent NPM packages to be extracted to a separate `vendor` chunks
         * (loaded as `modulepreload`, unsupported by Firefox and Safari):
         * - https://rollupjs.org/guide/en/#outputmanualchunks
         * - https://github.com/vitejs/vite/discussions/2462
         */
        manualChunks: [],
      },
    },
  },

  // envPrefix: ['VITE_'],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  plugins: [
    ...(isProd ? [] : [eslintPlugin(esLintOptions)]),
    ...(isProd ? [] : [createHtmlPlugin(htmlOptions)]),
    ...(isProd ? [] : [viteSingleFile(singleFileOptions)]),
  ],

  server: {
    open: env?.BROWSER_OPEN == 'true',
  },
})
