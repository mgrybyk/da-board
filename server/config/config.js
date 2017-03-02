'use strict'
var pathToApp = 'www'
var pathToWorkDir = 'workDir'

module.exports = {
  host: '',
  port: 80,

  pathToApp: pathToApp,
  appHtml: pathToApp + '/index.html',

  pathToResults: 'db/results',
  pathToAllureBin: 'allure-cli/bin',

  pathToWdInput: pathToWorkDir + '/input',
  pathToWdOutput: pathToWorkDir + '/output',

  algorithm: 'aes256',
  key: 'daBoard MG*(P$G',

  shareFolder: '/mnt/STD_SRA/allureResults',
  testFolderPrefix: 'allure-results_',
  testFolderSuffixLength: 13, // timestamp length
  copyCompleteFile: 'COPY_COMPLETE'
}
