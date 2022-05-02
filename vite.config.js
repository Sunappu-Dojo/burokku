import { defineConfig } from 'vite'
import { resolve } from 'path'

import eslintPlugin from 'vite-plugin-eslint'

// env
const env = require('dotenv').config().parsed
const isProd = env.NODE_ENV === 'production'

let outDir = env.APP_BUILD_DIR || 'public'

// Prevents to output app files outside of the project root.
if (outDir.includes('../')) {
  throw new Error('APP_BUILD_DIR (in the .env file) can’t point to an upper-level directory. Remove all `../`.')
}

// helper to root project path
const thePath = (path = '') => resolve(__dirname, path)

// ESLint Options
const esLintOptions = {
  cache: false, // cache is cleaned on `npm install`
  cacheStrategy: 'content',
  fix: env.ES_LINT_AUTOFIX == 'true',
  formatter: env.ES_LINT_FORMATTER ?? 'stylish',
}

export default defineConfig({
  root: 'src',

  build: {
    envDir: './',
    outDir: `../${outDir}`,
    emptyOutDir: true,
    cssCodeSplit: false,
    polyfillModulePreload: false,
    rollupOptions: {
      input: {
        'js/burokku': thePath('./src/index.html'),
        'block-service-worker': thePath('./src/js/service-worker.js'),
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
  ],

  server: {
    open: env.BROWSER_OPEN == 'true',
  },
})
