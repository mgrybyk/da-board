'use strict'

const Results = require('./../models/Results')

exports.getResults = (req, res, next) => {
  // lean returns plain js objects instead of mongoose docs
  // which is ~3 times faster and is just what we need.
  Results.getPeriodResults(req.params.period).lean().exec((err, results) => {
    if (err) return next(err, req, res, next)
    return res.send(results)
  })
}
