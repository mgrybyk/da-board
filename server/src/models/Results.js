'use strict'

const mongoose = require('mongoose')
const limitWeek = 50
const limitMonth = 150
const limitQuarter = 250
const limitHalf = 900
const sorting = { 'timestamp': -1 }

var schema = mongoose.Schema({
  timestamp: { type: Number, unique: true, required: true, dropDups: true },
  name: String,
  link: String,
  integration: String,
  test: Object,
  build: Object,
  config: Object,
  allureVersion: String
})

schema.statics.getOne = (timestamp, cb) => Model.findOne({ timestamp: timestamp }).exec(cb)

schema.statics.findLatestOne = (conditions, cb) => Model
  .find(conditions)
  .sort(sorting)
  .limit(1)
  .lean()
  .exec(cb)

schema.statics.getPeriodResults = function (period) {
  if (period === '1') {
    return getAllResults(this).limit(limitWeek)
  } else if (period === '2') {
    return getPartialResults(this, limitMonth, limitWeek)
  } else if (period === '3') {
    return getPartialResults(this, limitQuarter, limitMonth + limitWeek)
  } else if (period === '4') {
    return getPartialResults(this, limitHalf, limitQuarter + limitMonth + limitWeek)
  } else if (period === '5') {
    return getAllResults(this).skip(limitHalf + limitQuarter + limitMonth + limitWeek)
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

const Model = mongoose.model('Results', schema)
module.exports = Model
