'use strict'

const fse = require('fs-extra')
const unzip = require('unzip')
const path = require('path')
const os = require('os')
const spawn = require('child_process')
const properties = require('properties')
const resultsHelper = require('./resultsHelper')

let lastCleanupTimestamp = new Date().getTime()
const cleaupQuietPeriod = 300000 // 300 seconds -> 5 minutes
const resultsLimit = 300
const inputDir = resultsHelper.inputDir
const outputDir = resultsHelper.outputDir

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
    rs.pipe(unzip.Extract({ path: allureInput })).on('finish', () => {
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

function runAllureCli (allureInput, allureOutput, allureOutputData) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()
    let pathToAllureBin = path.join(CONFIG.rootDir, CONFIG.pathToAllureBin)
    let spawnCmd = `cd ${pathToAllureBin} && ${pathToAllureBin}/allure${os.platform().includes('win') ? '.bat' : ''} generate ${allureInput} -o ${allureOutput}`
    spawn.exec(spawnCmd, () => {
      log.verbose(`allure report generated, spent ${resultsHelper.timeSpent(timeStart)}`)

      timeStart = Date.now()
      fse.ensureDir(allureOutputData, function (err) {
        log.verbose(`allure report generation verified, spent ${resultsHelper.timeSpent(timeStart)}`)
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  })
}

function parseCopyComplete (allureInput, timestamp) {
  return new Promise((resolve, reject) => {
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

function moveToResultsAndParseStatistic (dbRecord, allureOutputData, timestamp) {
  return new Promise((resolve, reject) => {
    let resultsDir = path.join(CONFIG.rootDir, CONFIG.pathToResults, timestamp, 'data')

    fse.move(allureOutputData, resultsDir, {
      overwrite: true
    }, errMove => {
      if (errMove) {
        return reject(errMove)
      }

      let pathToTotalJson = path.join(resultsDir, 'total.json')
      resultsHelper.parseStatistic(dbRecord, pathToTotalJson)
        .then(dbRecord => resolve(dbRecord))
    })
  })
}

function deleteOldResults () {
  let resultsDir = path.join(CONFIG.rootDir, CONFIG.pathToResults)
  log.verbose(`delete old results, path to results dir: ${resultsDir}`)
  fse.readdir(resultsDir, (err, dirs) => {
    if (err) {
      return err
    }
    log.verbose(`delete old results, count: ${dirs.length}, limit ${resultsLimit}`)
    dirs.sort()
    while (dirs.length > resultsLimit) {
      let dirToRemove = dirs.shift()
      log.verbose(`delete old results, deleting: ${dirToRemove}`)
      fse.remove()
    }
  })
}
