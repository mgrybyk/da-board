'use strict'

const path = require('path')
const fse = require('fs-extra')
const request = require('request')
const resultsHelper = require('./resultsHelper')

const inputDir = resultsHelper.inputDir

module.exports.newResult = function (params) {
  let timestamp = String(new Date().getTime())
  let allureInput = path.join(inputDir, timestamp)
  fse.ensureDirSync(allureInput)
  let pathToSummaryJson = path.join(allureInput, 'summary.json')

  let integration = $store.getters.integrations[params.integration]

  async function flow () {
    try {
      if (params.download_file) {
        await downloadTotalJson(params.link + params.download_file, pathToSummaryJson, integration)
      }
      let dbRecord = resultsHelper.buildDbRecord(timestamp, params)
      if (params.download_file) {
        await parseStatistic(pathToSummaryJson, dbRecord)
      }
      dbRecord.test.duration = resultsHelper.msToTime(dbRecord.test.duration)
      await resultsHelper.saveResultRecord(dbRecord)
    } catch (err) {
      log.error(err)
    }
    await resultsHelper.cleanUp(allureInput)
  }
  flow()
}

function downloadTotalJson (link, filePath, integration) {
  return new Promise((resolve, reject) => {
    let requestParams = {
      url: link
    }
    if (integration.auth) {
      requestParams.auth = integration.auth
    }
    request(requestParams)
      .pipe(fse.createWriteStream(filePath))
      .on('close', () => resolve())
  })
}

async function parseStatistic (pathToSummaryJson, dbRecord) {
  const test = await resultsHelper.parseStatistic(pathToSummaryJson)
  dbRecord.test = Object.assign(dbRecord.test, test)
}
