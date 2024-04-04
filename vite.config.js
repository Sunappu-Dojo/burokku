import { resolve } from 'node:path'
import { homedir } from 'node:os'
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
    'js/helpers/idbDetect.js',
  ],
}

/**
 * HTTPS, works well with Laravel Valet (macOS)
 * Laravel Valet HTTPS: https://github.com/laravel/docs/blob/master/valet.md#securing-sites-with-tls
 * Not tested with other setups.
 */

const host = env?.SERVER_HOST ?? null
let https = env?.SERVER_HTTPS === 'true'

if (https && host && env.SERVER_CERTIFICATES_DIR) {
  const certificatesPath = `${homedir()}/${env.SERVER_CERTIFICATES_DIR}/${host}`

  https = {
    key: `${certificatesPath}.key`,
    cert: `${certificatesPath}.crt`,
  }
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
        'js/helpers/idbDetect': resolve('./src/js/helpers/idbDetect.js'),
        'js/utils/ServiceWorker': resolve('./src/js/utils/ServiceWorker/index.js'),
        'block-service-worker': resolve('./src/js/service-worker.js'),
      },
      output: {
        // Preserve filenames, needed for Service Worker caching.
        entryFileNames: '[name].js', // JS entries
        chunkFileNames: 'js/modules/[name].js', // JS chunks
        assetFileNames: 'css/burokku.css', // other files (CSS only for now)
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
    open: env?.BROWSER_OPEN === 'true',
    ...(host ? { host } : null),
    https,
  },
})
