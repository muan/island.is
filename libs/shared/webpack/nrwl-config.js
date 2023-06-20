const DefinePlugin = require('webpack/lib/DefinePlugin')
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin')
const webpack = require('webpack')

/**
 * This file is based on how @nrwl/web does it's env config
 * https://github.com/nrwl/nx/blob/master/packages/web/src/utils/config.ts#L84
 * https://github.com/nrwl/nx/blob/master/packages/web/src/utils/config.ts#L201
 */

/**
 * This functions finds the DefinePlugin from the webpack plugins list
 * And sets the API_MOCKS env variable to make sure it is always set.
 */
const setApiMocks = (config) => {
  config.plugins.forEach((plugin) => {
    // Find the DefinePlugin and check if it has 'process.env' key
    if (plugin instanceof DefinePlugin && plugin.definitions['process.env']) {
      // Switch from 'process.env' definition to 'process.env.*' definitions.
      // Otherwise webpack is unable to properly remove unused code from bundles.
      plugin.definitions = Object.entries(
        plugin.definitions['process.env'],
      ).reduce(
        (defs, [key, value]) => ({ ...defs, [`process.env.${key}`]: value }),
        {},
      )

      // Set API_MOCKS so it's always set before webpack does its things
      plugin.definitions['process.env.API_MOCKS'] = JSON.stringify(
        process.env.API_MOCKS || '',
      )
    }
  })
}

// UPGRADE WARNING
// This is to fix a bug in @nrwl/web 11.4.0 where some css rules would have misconfigured postcss.
// Can be removed after upgrading to 12.1.0 or beyond. This should not appear in build logs when this is removed:
// "You did not set any plugins, parser, or stringifier. Right now, PostCSS does nothing. Pick plugins for your case on https://www.postcss.parts/ and use them in postcss.config.js."
const fixPostcss = (config) => {
  config.module.rules.forEach((rule) => {
    // Find CSS-like rule.
    if (!Array.isArray(rule.oneOf)) {
      return
    }
    rule.oneOf.forEach((subRule) => {
      // Find css-like use array.
      if (!Array.isArray(subRule.use)) {
        return
      }
      subRule.use.forEach((use) => {
        // Find postcss loader.
        if (!use.loader?.includes('postcss-loader')) {
          return
        }
        // Fix accidental nested postcssOptions.
        if (use.options.postcssOptions?.postcssOptions) {
          use.options = use.options.postcssOptions
        }
      })
    })
  })
}

/**
 * This method adds the polyfills that webpack4 previously added
 * but was removed in webpack 5. NextJS does this for the Next apps
 * @param {*} config Webpack config object
 */
const addNodeModulesPolyfill = (config) => {
  config.resolve.fallback = {
    assert: require.resolve('assert'),
    buffer: require.resolve('buffer'),
    console: require.resolve('console-browserify'),
    constants: require.resolve('constants-browserify'),
    crypto: require.resolve('crypto-browserify'),
    domain: require.resolve('domain-browser'),
    events: require.resolve('events'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    path: require.resolve('path-browserify'),
    punycode: require.resolve('punycode'),
    process: require.resolve('process/browser'),
    querystring: require.resolve('querystring-es3'),
    stream: require.resolve('stream-browserify'),
    string_decoder: require.resolve('string_decoder'),
    sys: require.resolve('util'),
    timers: require.resolve('timers-browserify'),
    tty: require.resolve('tty-browserify'),
    url: require.resolve('url'),
    util: require.resolve('util'),
    vm: require.resolve('vm-browserify'),
    zlib: require.resolve('browserify-zlib'),
  }

  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: [require.resolve('buffer'), 'Buffer'],
      process: [require.resolve('process')],
    }),
  )
}

/**
 * NX's withReact loads svg's as React components when imported from js/ts files.
 * But it doesn't work when dynamically imported like this: import(`./svg/${dynamic}.svg`)
 *
 * This pattern is currently used in financial-aid to load logos. It also loads them in an <img> tag, so it expects
 * URLs rather than react components. Ideally we can devise a better way to manage these logos and get rid of this
 * hack in the future.
 *
 * UPGRADE WARNING: This is designed to catch SVGs which are unhandled by withReact.
 * @param config
 */
function addFallbackSvgLoader(config) {
  config.module.rules.push({
    test: /\.svg$/,
    issuer: { not: /\.(js|ts|md)x?$/ },
    loader: require.resolve('file-loader'),
    options: {
      name: `[name].[contenthash:20].[ext]`,
    },
  })
}

/**
 * Adds common web related configs to webpack
 * @param {*} config Webpack config object
 * @param {*} context  NxWebpackExecutionContext
 */
module.exports = function (config) {
  setApiMocks(config)
  addNodeModulesPolyfill(config)
  addFallbackSvgLoader(config)

  fixPostcss(config)

  // Add the Vanilla Extract plugin
  config.plugins.push(new VanillaExtractPlugin())

  // Disable stats for child compilations
  config.stats.children = false

  return config
}
