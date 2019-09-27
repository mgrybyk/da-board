'use strict'
require('dotenv').config()

const PATH_TO_APP = 'www'
const PATH_TO_WORKDIR = 'workDir'

module.exports = {
  host: process.env.EXPRESS_HOST || '',
  port: process.env.EXPRESS_PORT || '81',

  pathToApp: PATH_TO_APP,
  appHtml: PATH_TO_APP + '/index.html',

  pathToResults: 'db/results',
  DB_RESULTS_FOLDER_LIMIT: 300 || process.env.DB_RESULTS_FOLDER_LIMIT,
  pathToAllureBin: 'node_modules/.bin',
  ALLURE_DATA_FOLDERS: ['data', 'export', 'history', 'widgets'],

  PATH_TO_WORKDIR: PATH_TO_WORKDIR,
  pathToWdInput: PATH_TO_WORKDIR + '/input',
  pathToWdOutput: PATH_TO_WORKDIR + '/output',

  algorithm: 'aes256',
  key: process.env.PASSPORT_KEY || 'daBoard MG*(P$G',

  allureEnvProperties: 'environment.properties'
}
