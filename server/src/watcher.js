'use strict'

var fse = require('fs-extra')
var path = require('path')
var chokidar = require('chokidar')
var spawn = require('child_process')
var properties = require('properties')
var Results = require('./models/Results')
const zipFileName = 'allure-results.zip'

var copyComplete = `/${CONFIG.copyCompleteFile}`
var chokidarConfig = {
  persistent: true,
  cwd: CONFIG.shareFolder,
  usePolling: true,
  alwaysStat: false,
  depth: 1,
  interval: 11301,
  binaryInterval: 13000,

  ignorePermissionErrors: true,
  atomic: true
}

var workers = []

module.exports = function () {
  var watcher = chokidar.watch([], chokidarConfig)
  watcher.add([''])

  watcher.on('add', function (filePath) {
    // look for COPY_COMPLETE in test result folder. We don't care about other files and folders there
    if (filePath.indexOf(CONFIG.testFolderPrefix) !== 0 || filePath.substr(-copyComplete.length) !== copyComplete) return
    let allureFolder = filePath.split('/')[0]
    if (allureFolder.length !== CONFIG.testFolderPrefix.length + CONFIG.testFolderSuffixLength) return

    // notify about COPY_COMPLETE file
    log.info(`Received: ${filePath}`)

    // copy to work dir
    let allureFolderPath = path.join(CONFIG.shareFolder, allureFolder)
    let allureInput = path.join(CONFIG.rootDir, CONFIG.pathToWdInput, allureFolder)
    let allureOutput = path.join(CONFIG.rootDir, CONFIG.pathToWdOutput, allureFolder)
    let allureOutputData = path.join(allureOutput, 'data')
    let timestamp = allureFolder.substr(-CONFIG.testFolderSuffixLength)

    log.verbose('workers:')
    log.verbose(workers)
    if (!workers.includes(timestamp)) {
      workers.push(timestamp);

      (async () => {
        let copyResult = await copyToWorkDir(allureFolderPath, allureInput, allureFolder, 1)
        if (!copyResult) {
          for (var index = 0; index < 60 && !copyResult; index++) {
            copyResult = await copyToWorkDir(allureFolderPath, allureInput, allureFolder, 60 * 1000)
          }
        }
        await unzipAllureResults(allureInput, zipFileName)
        await runAllureCli(allureInput, allureOutput, allureOutputData)
        let dbRecord = await parseCopyComplete(allureInput, timestamp)
        await moveToResultsAndParseStatistic(dbRecord, allureOutputData, timestamp)
        await saveResultRecord(dbRecord)
        workers = workers.filter(e => e !== timestamp)
        await cleanUp(allureFolder, allureFolderPath, allureInput, allureOutput)
      })()
    }
  })
}

function copyToWorkDir (allureFolderPath, allureInput, allureFolder, delay) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()
    setTimeout(() => {
      cp_copy(allureFolderPath, allureInput, (err) => {
        if (err) {
          log.warn(`Failed to copy results from network share: ${allureFolder}, spent ${timeSpent(timeStart)}`)
          log.error(err)
          return resolve(false)
        }
        log.verbose(`Copied to workDir: ${allureFolder}, spent ${timeSpent(timeStart)}`)
        resolve(true)
      })
    }, delay)
  })
}

function unzipAllureResults (allureInput, zipFileName) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()
    cp_unzip(path.join(allureInput, zipFileName), allureInput, (err) => {
      if (err) return reject(err)
      log.verbose(`Unzipped archive, spent ${timeSpent(timeStart)}`)

      timeStart = Date.now()
      cp_rm(path.join(allureInput, zipFileName), (err1) => {
        if (err1) log.error(err1)
        else log.verbose(`removed zip file, spent ${timeSpent(timeStart)}`)
        resolve()
      })
    })
  })
}

function runAllureCli (allureInput, allureOutput, allureOutputData) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()
    spawn.exec(`cd ${path.join(CONFIG.rootDir, CONFIG.pathToAllureBin)} ; ./allure generate ${allureInput} -o ${allureOutput}`, () => {
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

    properties.parse(path.join(allureInput, copyComplete), { path: true, namespaces: true }, (err, obj) => {
      if (err) return reject(err)

      let dbRecord = Object.assign({ 'timestamp': timestamp * 1 }, obj)

      // is nix
      dbRecord.env.isNix = dbRecord.env.osName && dbRecord.env.osName.includes('Linux')
      delete dbRecord.env.osName

      // shorten osNameExt
      dbRecord.env.osNameExt = dbRecord.env.osNameExt && dbRecord.env.osNameExt
        .replace('Linux', '')
        .replace('Enterprise', '')
        .replace('release', '')
        .replace(/\(.*\)/, '')
        .replace(/\s+/g, ' ')
        .trim()

      // beautify db name
      if (dbRecord.env.dbName) {
        dbRecord.env.dbName = dbRecord.env.dbName.replace('sqlserver', 'MSSQL')
        dbRecord.env.dbName = dbRecord.env.dbName[0].toUpperCase() + dbRecord.env.dbName.slice(1)
      }

      // determine process
      if (dbRecord.processName) {
        dbRecord.process = { name: dbRecord.processName }

        let processArr = dbRecord.processName.split('-')
        if (processArr[1] === 'zpecial') dbRecord.process.type = processArr[2]
        else if (processArr[1] === 'upgrade') dbRecord.process.type = `upgrade ${processArr[2]}`
        else if (processArr[1] === 'clean') dbRecord.process.type = 'Clean'
        else dbRecord.process.type = dbRecord.processName

        delete dbRecord.processName
      }

      // set icon
      if (dbRecord.test.type === 'rest') dbRecord.test.icon = 'terminal.png'
      else if (dbRecord.test.type !== 'ui2') dbRecord.test.icon = 'unknown_test_type.png'
      else if (!dbRecord.test.browser) dbRecord.test.icon = 'unknown_browser.png'
      else if (dbRecord.test.browser.toLowerCase().includes('chrome')) dbRecord.test.icon = 'chrome.png'
      else if (dbRecord.test.browser.toLowerCase().includes('firefox')) dbRecord.test.icon = 'firefox.png'
      else if (dbRecord.test.browser.toLowerCase().includes('internet explorer')) dbRecord.test.icon = 'internet_explorer11.png'
      else if (dbRecord.test.browser.toLowerCase().includes('edge')) dbRecord.test.icon = 'edge.png'
      else dbRecord.test.icon = 'unknown_browser.png'

      log.verbose(`COPY_COMPLETE parsed, spent ${timeSpent(timeStart)}`)
      log.verbose(dbRecord)
      resolve(dbRecord)
    })
  })
}

function moveToResultsAndParseStatistic (dbRecord, allureOutputData, timestamp) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()
    let resultsDir = path.join(CONFIG.rootDir, CONFIG.pathToResults, timestamp, 'data')

    cp_move(allureOutputData, resultsDir, (errCopy) => {
      if (errCopy) return reject(errCopy)
      log.verbose(`test results moved to results folder, spent ${timeSpent(timeStart)}`)

      timeStart = Date.now()
      fse.readJson(path.join(resultsDir, 'total.json'), function (errJson, totalJson) {
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
      log.verbose(`work with databased completed, spent ${timeSpent(timeStart)}`)
      if (err) return reject(err)
      log.info(`test results are now available: ${dbRecord.timestamp}`)
      log.verbose(dbRecord.statistic)
      resolve()
    })
  })
}

function cleanUp (allureFolder, allureFolderPath, allureInput, allureOutput) {
  return new Promise((resolve, reject) => {
    let timeStart = Date.now()

    cp_rm(allureInput, (err1) => {
      if (err1) log.error(err1)
      else log.verbose(`work input cleaned, spent ${timeSpent(timeStart)}`)

      timeStart = Date.now()
      cp_rm(allureOutput, (err2) => {
        if (err2) log.error(err2)
        else log.verbose(`work output cleaned, spent ${timeSpent(timeStart)}`)

        timeStart = Date.now()
        cp_rm(allureFolderPath, (err3) => {
          if (err3) log.error(err3)
          else log.verbose(`share cleaned up, spent ${timeSpent(timeStart)}`)

          resolve()
        })
      })
    })
  })
}

function cp_copy (source, target, callback) {
  var execStr = `rm -rf ${target} ; cp -rf ${source} ${target}`
  log.verbose(`running: ${execStr}`)
  spawn.exec(execStr, (err, stdout, stderr) => {
    if (stdout) log.info(stdout)
    if (stderr) log.error(stderr)
    callback(err)
  })
}

function cp_move (source, target, callback) {
  var execStr = `mkdir -p ${target} ; rm -rf ${target} ; mv ${source} ${target}`
  log.verbose(`running: ${execStr}`)
  spawn.exec(execStr, (err, stdout, stderr) => {
    if (stdout) log.info(stdout)
    if (stderr) log.error(stderr)
    callback(err)
  })
}

function cp_rm (target, callback) {
  var execStr = `rm -rf ${target}`
  log.verbose(`running: ${execStr}`)
  spawn.exec(execStr, (err, stdout, stderr) => {
    if (stdout) log.info(stdout)
    if (stderr) log.error(stderr)
    callback(err)
  })
}

function cp_unzip (source, destination, callback) {
  var execStr = `unzip -oq ${source} -d ${destination}`
  log.verbose(`running: ${execStr}`)
  spawn.exec(execStr, (err, stdout, stderr) => {
    if (stdout) log.info(stdout)
    if (stderr) log.error(stderr)
    callback(err)
  })
}

// function normalizeCopyCompleteStr (str) {
//   if (str == null) {
//     log.warn('Empty or null string received.')
//     return ''
//   }
//   return str
//     .replace(/(\r\n|\n|\r)/gm, '') // remove \r \n etc
//     .replace(/"/g, '') // remove "
// }

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
