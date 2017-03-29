'use strict'
var pathToApp = 'www'
var pathToWorkDir = 'workDir'

module.exports = {
  host: '',
  port: 81,

  pathToApp: pathToApp,
  appHtml: pathToApp + '/index.html',

  pathToResults: 'db/results',
  pathToAllureBin: 'allure-cli/bin',

  pathToWdInput: pathToWorkDir + '/input',
  pathToWdOutput: pathToWorkDir + '/output',

  algorithm: 'aes256',
  key: 'daBoard MG*(P$G',

  allureEnvProperties: 'environment.properties'
}
