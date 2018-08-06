const CopywebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = {
  configureWebpack: {
    output: {
      // Needed to compile multiline strings in Cesium
      sourcePrefix: ''
    },
    amd: {
      // Enable webpack-friendly use of require in Cesium
      toUrlUndefined: true
    },
    node: {
      // Resolve node module use of fs
      fs: 'empty'
    },
    plugins: [
      // Copy Cesium Assets, Widgets, and Workers to a static directory
      new CopywebpackPlugin([ { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' } ]),
      new CopywebpackPlugin([ { from: path.join(cesiumSource, 'Assets'), to: 'Assets' } ]),
      new CopywebpackPlugin([ { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' } ]),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('')
      })
    ],
    resolve: {
      alias: {
        // Cesium module name
        cesium: path.resolve(__dirname, cesiumSource)
      }
    }
  }
}
