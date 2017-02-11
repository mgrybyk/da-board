'use strict'

var mongoose = require('mongoose')
var limitWeek = 30
var limitMonth = 150
var limitQuarter = 450
var limitHalf = 900
var sorting = { 'timestamp': -1 }

var schema = mongoose.Schema({
  timestamp: Number,
  name: String,
  test: Object,
  build: Object
})

schema.statics.getPeriodResults = function (period) {
  if (period === '1') {
    return getAllResults(this).limit(limitWeek)
  } else if (period === '2') {
    return getPartialResults(this, limitMonth, limitWeek)
  } else if (period === '3') {
    return getPartialResults(this, limitQuarter, limitMonth)
  } else if (period === '4') {
    return getPartialResults(this, limitHalf, limitQuarter)
  } else if (period === '5') {
    return getAllResults(this).skip(limitHalf)
  } else if (period === '0') {
    return getAllResults(this)
  } else {
    return { exec: cb => cb({ message: `Unknown period: ${period}` }) }
  }
}

function getAllResults (context) {
  return context.find().sort(sorting)
}

function getPartialResults (context, limit, skip) {
  return getAllResults(context).limit(limit).skip(skip)
}

module.exports = mongoose.model('Results', schema)
