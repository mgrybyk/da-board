'use strict'

const fse = require('fs-extra')
const unzip = require('unzipper')
const path = require('path')
const os = require('os')
const spawn = require('child_process')
const properties = require('properties')
const resultsHelper = require('./resultsHelper')

const ALLURE_PROPERTIES_FILE = 'allure.properties'
const ALLURE_HISTORY_FOLDER = 'history'
const cleaupQuietPeriod = 30000 // 30 seconds
let lastCleanupTimestamp = new Date().getTime() - cleaupQuietPeriod
const resultsLimit = CONFIG.DB_RESULTS_FOLDER_LIMIT
const inputDir = resultsHelper.inputDir
const outputDir = resultsHelper.outputDir

module.exports.newResult = function (uploadedFile) {
  let timestamp = uploadedFile.split('.')[0]
  let allureInput = path.join(inputDir, timestamp)
  let allureOutput = path.join(outputDir, timestamp)
  let pathToSummaryJson = path.join(allureOutput, 'widgets', 'summary.json')

  async function flow () {
    await unzipAllureResults(inputDir, timestamp, allureInput)
    await copyAllureProperties(allureInput)
    let dbRecord = await parseCopyComplete(allureInput, timestamp)
    await copyHistory(allureInput, dbRecord)
    await runAllureCli(allureInput, allureOutput, pathToSummaryJson)
    await parseStatistic(pathToSummaryJson, dbRecord)
    await Promise.all(CONFIG.ALLURE_DATA_FOLDERS.map(dataFolder => moveDataFolder(allureOutput, timestamp, dataFolder)))
    dbRecord.test.duration = resultsHelper.msToTime(dbRecord.test.duration)
    await resultsHelper.saveResultRecord(dbRecord)
    await resultsHelper.cleanUp(allureInput)
    await resultsHelper.cleanUp(allureOutput)
    if (new Date().getTime() - lastCleanupTimestamp > cleaupQuietPeriod) {
      lastCleanupTimestamp = new Date().getTime()
      deleteOldResults()
    }
  }
  flow()
}

function unzipAllureResults (inputDir, timestamp, allureInput) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()
    let pathToZip = path.join(inputDir, timestamp + '.zip')
    let rs = fse.createReadStream(pathToZip)
    rs.on('error', errUnzip => reject(errUnzip))
    rs.pipe(unzip.Extract({ path: allureInput })).on('close', () => {
      log.verbose(`Unzipped archive, spent ${resultsHelper.timeSpent(timeStart)}`)

      timeStart = Date.now()
      fse.remove(pathToZip, errRemove => {
        if (errRemove) {
          log.error(errRemove)
        } else {
          log.verbose(`removed zip file, spent ${resultsHelper.timeSpent(timeStart)}`)
        }
        resolve()
      })
    })
  })
}

function copyAllureProperties (allureInput) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()
    fse.copy(ALLURE_PROPERTIES_FILE, `${allureInput}/${ALLURE_PROPERTIES_FILE}`, err => {
      log.verbose(`copied ${ALLURE_PROPERTIES_FILE} to ${allureInput}, spent ${resultsHelper.timeSpent(timeStart)}`)
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

async function copyHistory (allureInput, { name, test, config }) {
  const timestamp = await resultsHelper.getLastTimestamp(name, test, config)
  if (!timestamp) {
    // no historic data
    return
  }
  const pathToHistory = path.join(CONFIG.rootDir, CONFIG.pathToResults, '' + timestamp, ALLURE_HISTORY_FOLDER)
  const historyExists = await new Promise(resolve => fse.pathExists(pathToHistory, (err, exists) => resolve(!!exists)))
  if (!historyExists) {
    return log.verbose('allure history: timestamp was not found in file system')
  }
  await new Promise((resolve, reject) =>
    fse.copy(pathToHistory, path.join(allureInput, ALLURE_HISTORY_FOLDER), err => {
      if (err) {
        return reject(err)
      }
      log.verbose('allure history copied')
      resolve()
    }))
}

function runAllureCli (allureInput, allureOutput, pathToSummaryJson) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()
    let pathToAllureBin = path.join(CONFIG.rootDir, CONFIG.pathToAllureBin)
    let spawnCmd = `${pathToAllureBin}/allure${os.platform() === 'win32' ? '.cmd' : ''} generate --clean ${allureInput} -o ${allureOutput}`
    spawn.exec(spawnCmd, (error, stdout, stderr) => {
      log.verbose(`allure report generated, spent ${resultsHelper.timeSpent(timeStart)}`)
      if (stdout) {
        log.verbose(stdout.toString())
      }
      if (error || stderr) {
        log.error(stderr.toString())
        log.error(error)
        return reject('allure cli failed')
      }

      timeStart = Date.now()
      fse.pathExists(pathToSummaryJson, function (err, exists) {
        log.verbose(`allure report generation verified, spent ${resultsHelper.timeSpent(timeStart)}`)
        if (err || !exists) {
          return reject(err)
        }
        resolve()
      })
    })
  })
}

function parseCopyComplete (allureInput, timestamp) {
  return new Promise((resolve, reject) => {
    log.verbose('parseCopyComplete')
    properties.parse(path.join(allureInput, CONFIG.allureEnvProperties), {
      path: true,
      namespaces: true
    }, (err, obj) => {
      if (err) {
        return reject(err)
      }

      let dbRecord = resultsHelper.buildDbRecord(timestamp, obj)
      resolve(dbRecord)
    })
  })
}

function moveDataFolder (allureOutput, timestamp, dataFolder) {
  return new Promise((resolve, reject) => {
    log.verbose('moveDataFolder', dataFolder)
    let resultsDir = path.join(CONFIG.rootDir, CONFIG.pathToResults, timestamp, dataFolder)

    fse.move(path.join(allureOutput, dataFolder), resultsDir, {
      overwrite: true
    }, errMove => {
      if (errMove) {
        return reject(errMove)
      }

      resolve()
    })
  })
}

async function parseStatistic (pathToSummaryJson, dbRecord) {
  log.verbose('parseStatistic')
  const test = await resultsHelper.parseStatistic(pathToSummaryJson)
  dbRecord.test = Object.assign(dbRecord.test, test)
}

function deleteOldResults () {
  let resultsDir = path.join(CONFIG.rootDir, CONFIG.pathToResults)
  fse.readdir(resultsDir, (err, dirs) => {
    log.verbose(`delete old results, count: ${dirs.length}, limit ${resultsLimit}`)
    if (err) {
      return err
    }
    dirs.sort()
    while (dirs.length > resultsLimit) {
      let dirToRemove = dirs.shift()
      fse.remove(path.join(resultsDir, dirToRemove), errIgnored => {})
    }
  })
}
