'use strict'

const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const request = require('request')
const resultsHelper = require('./resultsHelper')

const inputDir = resultsHelper.inputDir

module.exports.newResult = function (params) {
  let timestamp = String(new Date().getTime())
  let allureInput = path.join(inputDir, timestamp)
  fse.ensureDirSync(allureInput)
  let pathToTotalJson = path.join(allureInput, 'total.json')

  let integration = $store.getters.integrations[params.integration]

  async function flow () {
    try {
      if (params.download_file) {
        await downloadTotalJson(params.link + params.download_file, pathToTotalJson, integration)
      }
      let dbRecord = resultsHelper.buildDbRecord(timestamp, params)
      await parseStatistic(dbRecord, pathToTotalJson)
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
      .on('close', function () {
        resolve()
      })
  })
}

function parseStatistic (dbRecord, pathToTotalJson) {
  return resultsHelper.parseStatistic(dbRecord, pathToTotalJson)
}
