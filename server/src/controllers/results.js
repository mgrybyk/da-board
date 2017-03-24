'use strict'

const path = require('path')
const Results = require('./../models/Results')
const resultsFile = require('./resultsFile')

exports.getResults = (req, res, next) => {
  // lean returns plain js objects instead of mongoose docs
  // which is ~3 times faster and is just what we need.
  Results.getPeriodResults(req.params.period).lean().exec((err, results) => {
    if (err) return next(err, req, res, next)
    return res.send(results)
  })
}

exports.newFile = (req, res, next) => {
  if (!req.files) {
    // return next({ message: 'no file uploaded' }, req, res, next)
    log.error('no file')
  }

  let zipFile = req.files.results
  log.verbose(zipFile.name)

  // Use the mv() method to place the file somewhere on your server
  zipFile.mv(path.join(CONFIG.rootDir, CONFIG.pathToWdInput, zipFile.name), err => {
    if (err) {
      return log.error(err)
    }

    resultsFile.newResult(zipFile.name)
  })
  return res.send()
}
