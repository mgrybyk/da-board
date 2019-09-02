'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const config = require('../config')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(name => {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: 'DABoard',
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: 'client/assets/favicon.png'
    })
  ]
})
