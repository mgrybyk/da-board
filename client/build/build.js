// https://github.com/shelljs/shelljs
'use strict'

require('shelljs/global')
env.NODE_ENV = 'production'
const isSilent = process.argv[2] === 'silent'

const path = require('path')
const config = require('../config')
const ora = require('ora')
const webpack = require('webpack')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
!isSilent && spinner.start()

const assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'client/assets/*', assetsPath)

const compiler = webpack(webpackConfig)

compiler.run((err, stats) => {
  !isSilent && spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: !isSilent,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')
})
