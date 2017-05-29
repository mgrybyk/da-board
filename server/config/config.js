'use strict'
require('dotenv').config()

var pathToApp = 'www'
var pathToWorkDir = 'workDir'

module.exports = {
  host: process.env.EXPRESS_HOST || '',
  port: process.env.EXPRESS_PORT || '81',

  pathToApp: pathToApp,
  appHtml: pathToApp + '/index.html',

  pathToResults: 'db/results',
  pathToAllureBin: 'allure-cli/bin',

  pathToWdInput: pathToWorkDir + '/input',
  pathToWdOutput: pathToWorkDir + '/output',

  algorithm: 'aes256',
  key: process.env.PASSPORT_KEY || 'daBoard MG*(P$G',

  allureEnvProperties: 'environment.properties'
}
