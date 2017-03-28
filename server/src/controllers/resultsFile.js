'use strict'

const fse = require('fs-extra')
const unzip = require('unzip')
const path = require('path')
const os = require('os')
const spawn = require('child_process')
const properties = require('properties')
const Results = require('../models/Results')

const inputDir = path.join(CONFIG.rootDir, CONFIG.pathToWdInput)
const outputDir = path.join(CONFIG.rootDir, CONFIG.pathToWdOutput)
fse.ensureDirSync(inputDir)
fse.ensureDirSync(outputDir)

module.exports.newResult = function (uploadedFile) {
  let timestamp = uploadedFile.split('.')[0]
  let allureInput = path.join(inputDir, timestamp)
  let allureOutput = path.join(outputDir, timestamp)
  let allureOutputData = path.join(allureOutput, 'data')

  async function flow () {
    await unzipAllureResults(inputDir, timestamp, allureInput)
    await runAllureCli(allureInput, allureOutput, allureOutputData)
    let dbRecord = await parseCopyComplete(allureInput, timestamp)
    await moveToResultsAndParseStatistic(dbRecord, allureOutputData, timestamp)
    await saveResultRecord(dbRecord)
    await cleanUp(allureInput, allureOutput)
  }
  flow()
}

function unzipAllureResults (inputDir, timestamp, allureInput) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()
    let pathToZip = path.join(inputDir, timestamp + '.zip')
    let rs = fse.createReadStream(pathToZip)
    rs.on('error', errUnzip => reject(errUnzip))
    rs.pipe(unzip.Extract({ path: allureInput }))
      .on('finish', () => {
        log.verbose(`Unzipped archive, spent ${timeSpent(timeStart)}`)

        timeStart = Date.now()
        fse.remove(pathToZip, errRemove => {
          if (errRemove) log.error(errRemove)
          else log.verbose(`removed zip file, spent ${timeSpent(timeStart)}`)
          resolve()
        })
      })
  })
}

function runAllureCli (allureInput, allureOutput, allureOutputData) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()
    let pathToAllureBin = path.join(CONFIG.rootDir, CONFIG.pathToAllureBin)
    let spawnCmd = `cd ${pathToAllureBin} && ${pathToAllureBin}/allure${os.platform().includes('win') ? '.bat' : ''} generate ${allureInput} -o ${allureOutput}`
    spawn.exec(spawnCmd, () => {
      log.verbose(`allure report generated, spent ${timeSpent(timeStart)}`)

      timeStart = Date.now()
      fse.ensureDir(allureOutputData, function (err) {
        log.verbose(`allure report generation verified, spent ${timeSpent(timeStart)}`)
        if (err) return reject(err)
        resolve()
      })
    })
  })
}

function parseCopyComplete (allureInput, timestamp) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()

    properties.parse(path.join(allureInput, CONFIG.allureEnvProperties), { path: true, namespaces: true }, (err, obj) => {
      if (err) return reject(err)

      let dbRecord = {
        timestamp: timestamp * 1,
        name: obj.name,
        build: Object.assign({}, obj.build),
        test: Object.assign({}, obj.test)
      }

      // currently supported either rest or ui
      if (dbRecord.test.type.startsWith('rest')) dbRecord.test.type = 'rest'
      else if (dbRecord.test.type.startsWith('ui')) dbRecord.test.type = 'ui'

      // set icon. Maybe move to ui
      if (dbRecord.test.type === 'rest') dbRecord.test.icon = 'terminal'
      else if (dbRecord.test.type !== 'ui') dbRecord.test.icon = 'question'
      else if (!dbRecord.test.browser) dbRecord.test.icon = 'globe'
      else if (dbRecord.test.browser.toLowerCase().includes('chrome')) dbRecord.test.icon = 'chrome'
      else if (dbRecord.test.browser.toLowerCase().includes('firefox')) dbRecord.test.icon = 'firefox'
      else if (dbRecord.test.browser.toLowerCase().includes('internet explorer')) dbRecord.test.icon = 'internet-explorer'
      else if (dbRecord.test.browser.toLowerCase().includes('edge')) dbRecord.test.icon = 'edge'
      else dbRecord.test.icon = 'globe'

      log.verbose(`COPY_COMPLETE parsed, spent ${timeSpent(timeStart)}`, dbRecord)
      resolve(dbRecord)
    })
  })
}

function moveToResultsAndParseStatistic (dbRecord, allureOutputData, timestamp) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()
    let resultsDir = path.join(CONFIG.rootDir, CONFIG.pathToResults, timestamp, 'data')

    fse.move(allureOutputData, resultsDir, { overwrite: true }, errMove => {
      if (errMove) return reject(errMove)

      log.verbose(`test results moved to results folder, spent ${timeSpent(timeStart)}`)

      timeStart = Date.now()
      fse.readJson(path.join(resultsDir, 'total.json'), (errJson, totalJson) => {
        log.verbose(`statistic file parsed, spent ${timeSpent(timeStart)}`)
        if (errJson) return reject(errJson)
        dbRecord.test.failures = totalJson.statistic.failed + totalJson.statistic.broken
        dbRecord.test.passes = totalJson.statistic.passed
        dbRecord.test.total = totalJson.statistic.total
        dbRecord.test.duration = msToTime(totalJson.time.duration)
        resolve(dbRecord)
      })
    })
  })
}

function saveResultRecord (dbRecord) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()
    let result = new Results(dbRecord)
    result.save(function (err, saved) {
      log.verbose(`saved to database, spent ${timeSpent(timeStart)}`)
      if (err) return reject(err)
      log.info(`test results are now available: ${dbRecord.timestamp}`, dbRecord.test)
      io.emit('SOCKET_RESULTS_CHANGED')
      resolve()
    })
  })
}

function cleanUp (allureInput, allureOutput) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()

    fse.remove(allureInput, err1 => {
      if (err1) log.error(err1)
      else log.verbose(`work input cleaned, spent ${timeSpent(timeStart)}`)

      timeStart = Date.now()
      fse.remove(allureOutput, err2 => {
        if (err2) log.error(err2)
        else log.verbose(`work output cleaned, spent ${timeSpent(timeStart)}`)

        resolve()
      })
    })
  })
}

function msToTime (duration) {
  let seconds = parseInt((duration / 1000) % 60)
  let minutes = parseInt((duration / (1000 * 60)) % 60)
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds

  return hours + ':' + minutes + ':' + seconds
}

function timeSpent (startTIme) {
  return ((Date.now() - startTIme) * 0.001).toFixed(2)
}
