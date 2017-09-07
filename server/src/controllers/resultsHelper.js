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
    dbRecord.test.duration = totalJson.time.duration
    resolve(dbRecord)
  })
})

module.exports.buildDbRecord = function (timestamp, params) {
  let config = $store.getters.configs[params.name] || {}
  let dbRecord = {
    timestamp: timestamp * 1,
    name: params.name || 'Unknown config',
    integration: params.integration,
    link: params.link,
    build: Object.assign({}, params.build),
    test: Object.assign({}, params.test),
    config: {
      type: config.type,
      hostname: config.hostname,
      dbName: config.dbName,
      dbVersion: config.dbVersion,
      dbHostname: config.dbHostname,
      osNameExt: config.osNameExt,
      isNix: config.isNix,
      browser: config.browser
    }
  }

  // currently supported either rest or ui
  dbRecord.test.typeFull = dbRecord.test.type
  if (dbRecord.test.type.startsWith('rest')) dbRecord.test.type = 'rest'
  else if (dbRecord.test.type.startsWith('ui')) dbRecord.test.type = 'ui'
  else if (dbRecord.test.type.startsWith('perf')) dbRecord.test.type = 'perf'

  // set icon. Maybe move to ui
  if (dbRecord.test.type === 'rest') {
    dbRecord.test.icon = 'terminal'
    delete dbRecord.test.browser
  } else if (dbRecord.test.type === 'perf') {
    dbRecord.test.icon = 'tachometer'
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

module.exports.msToTime = (duration) => {
  if (duration === undefined || duration === null || isNaN(duration)) {
    return undefined
  }
  let seconds = parseInt((duration / 1000) % 60)
  let minutes = parseInt((duration / (1000 * 60)) % 60)
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds

  return hours + ':' + minutes + ':' + seconds
}

module.exports.timeSpent = function (startTime) {
  return ((Date.now() - startTime) * 0.001).toFixed(2)
}
