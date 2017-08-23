'use strict'

const fse = require('fs-extra')
const path = require('path')
const Results = require('../models/Results')

const inputDir = path.join(CONFIG.rootDir, CONFIG.pathToWdInput)
const outputDir = path.join(CONFIG.rootDir, CONFIG.pathToWdOutput)
fse.ensureDirSync(inputDir)
fse.ensureDirSync(outputDir)
module.exports.inputDir = inputDir
module.exports.outputDir = outputDir

module.exports.saveResultRecord = dbRecord => new Promise((resolve, reject) => {
  let result = new Results(dbRecord)
  result.save(function (err, saved) {
    if (err) return reject(err)
    log.info(`test results are now available: ${dbRecord.timestamp}`, dbRecord.test)
    io.emit('SOCKET_RESULTS_CHANGED')
    resolve()
  })
})

module.exports.parseStatistic = (dbRecord, pathToTotalJson) => new Promise((resolve, reject) => {
  fse.readJson(pathToTotalJson, (errJson, totalJson) => {
    if (errJson) return reject(errJson)
    dbRecord.test.failures = totalJson.statistic.failed + totalJson.statistic.broken
    dbRecord.test.passes = totalJson.statistic.passed
    dbRecord.test.total = totalJson.statistic.total
    dbRecord.test.duration = msToTime(totalJson.time.duration)
    resolve(dbRecord)
  })
})

module.exports.buildDbRecord = function (timestamp, params) {
  let dbRecord = {
    timestamp: timestamp * 1,
    name: params.name,
    integration: params.integration,
    build: Object.assign({}, params.build),
    test: Object.assign({}, params.test)
  }

  // currently supported either rest or ui
  if (dbRecord.test.type.startsWith('rest')) dbRecord.test.type = 'rest'
  else if (dbRecord.test.type.startsWith('ui')) dbRecord.test.type = 'ui'

  // set icon. Maybe move to ui
  if (dbRecord.test.type === 'rest') {
    dbRecord.test.icon = 'terminal'
    delete dbRecord.test.browser
  } else if (dbRecord.test.type !== 'ui') dbRecord.test.icon = 'question'
  else if (!dbRecord.test.browser) dbRecord.test.icon = 'globe'
  else if (dbRecord.test.browser.toLowerCase().includes('chrome')) dbRecord.test.icon = 'chrome'
  else if (dbRecord.test.browser.toLowerCase().includes('firefox')) dbRecord.test.icon = 'firefox'
  else if (dbRecord.test.browser.toLowerCase().includes('internet explorer')) dbRecord.test.icon = 'internet-explorer'
  else if (dbRecord.test.browser.toLowerCase().includes('edge')) dbRecord.test.icon = 'edge'
  else dbRecord.test.icon = 'globe'

  return dbRecord
}

module.exports.cleanUp = dir => new Promise((resolve, reject) => {
  fse.remove(dir, err1 => {
    if (err1) log.error(err1)
    resolve()
  })
})

function msToTime (duration) {
  let seconds = parseInt((duration / 1000) % 60)
  let minutes = parseInt((duration / (1000 * 60)) % 60)
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds

  return hours + ':' + minutes + ':' + seconds
}
module.exports.msToTime = msToTime

module.exports.timeSpent = function (startTIme) {
  return ((Date.now() - startTIme) * 0.001).toFixed(2)
}
