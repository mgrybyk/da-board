'use strict'

const mongoose = require('mongoose')

var schema = mongoose.Schema({
  name: { type: String, unique: true, required: true, dropDups: true },
  package: String,
  isFailure: Boolean,
  isCancelled: Boolean,
  isRunning: Boolean,
  startTime: Number,
  stages: Object,
  processId: String,
  processUrl: String,
  disabled: Boolean,
  userFlag: Object,
  timestamp: Number
})

schema.statics.getAll = cb => Model.find().exec(cb)
schema.statics.getOne = (name, cb) => Model.findOne({ name: name }).exec(cb)
schema.statics.removeOne = (name, cb) => Model.findOneAndRemove({ name: name }).exec(cb)

const Model = mongoose.model('Tiles', schema)
module.exports = Model
