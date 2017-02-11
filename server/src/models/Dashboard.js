'use strict'

var mongoose = require('mongoose')

var schema = mongoose.Schema({
  name: { type: String, unique: true, required: true, dropDups: true },
  package: String,
  isFailure: Boolean,
  isValid: Boolean,
  isCancelled: Boolean,
  isRunning: Boolean,
  startTime: Number,
  test: Object
}, { collection: 'dashboard' })

schema.statics.getDashboard = cb => Model.find().exec(cb)
schema.statics.getOne = (name, cb) => Model.findOne({ name: name }).exec(cb)

const Model = mongoose.model('Dashboard', schema)
module.exports = Model
