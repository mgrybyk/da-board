'use strict'

var mongoose = require('mongoose')
var sorting = { 'hostname': 1 }

var schema = mongoose.Schema({
  name: { type: String, unique: true, required: true, dropDups: true },
  type: String,
  hostname: String,
  dbName: String,
  dbVersion: String,
  osNameExt: String,
  browser: String,
  isNix: Boolean,
  duration: Number,
  disabled: Boolean
})

schema.statics.getAllConfigs = cb => Model.find().sort(sorting).exec(cb)
schema.statics.getOne = (name, cb) => Model.findOne({ name: name }).exec(cb)

const Model = mongoose.model('Configs', schema)
module.exports = Model

