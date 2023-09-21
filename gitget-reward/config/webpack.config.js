'use strict';

const { merge } = require('webpack-merge');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      popup: PATHS.src + '/popup.js',
      contentScript: PATHS.src + '/contentScript.js',
      background: PATHS.src + '/background.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    module: {
      rules: [{ test: /\.txt$/, use: 'raw-loader' }],
    },
    plugins: [
      new NodePolyfillPlugin()
    ]
  });

module.exports = config;
