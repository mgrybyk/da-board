'use strict'
var pathToApp = 'www'
var pathToWorkDir = 'workDir'
const port = process.argv[2] || '81'

module.exports = {
  host: '',
  port: port,

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
