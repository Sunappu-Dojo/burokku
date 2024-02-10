import { resolve } from 'node:path'
import { env } from 'node:process'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteSingleFile } from 'vite-plugin-singlefile'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import eslintPlugin from '@rollup/plugin-eslint'

const isProd = env?.NODE_ENV === 'production'

let outDir = env?.APP_BUILD_DIR || 'public'

// Prevents to output app files outside of the project root.
if (outDir.includes('../')) {
  throw new Error('APP_BUILD_DIR (in the .env file) can’t be outside of the app root directory. Remove all `../` from `APP_BUILD_DIR`.')
}

// ESLint Options
const esLintOptions = {
  cache: true, // cache is cleaned on `npm install`
  cacheStrategy: 'content',
  fix: env?.ES_LINT_AUTOFIX == 'true',
  formatter: env?.ES_LINT_FORMATTER ?? 'stylish',
  include: '**/*.+(js|mjs|ts)',
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

  css: {
    devSourcemap: true,
  },

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

  plugins: isProd ? [
    createHtmlPlugin(htmlOptions),
    viteSingleFile(singleFileOptions),
  ] : [
    {
      ...eslintPlugin(esLintOptions),
      enforce: 'pre',
    },
  ],

  server: {
    open: env?.BROWSER_OPEN == 'true',
  },
})
