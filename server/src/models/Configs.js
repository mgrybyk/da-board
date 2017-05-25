'use strict'

const mongoose = require('mongoose')
const sorting = { 'sortBy': 1 }

var schema = mongoose.Schema({
  name: { type: String, unique: true, required: true, dropDups: true },
  integration: Object,
  type: String,
  hostname: String,
  dbName: String,
  dbVersion: String,
  dbHostname: String,
  osNameExt: String,
  browser: String,
  isNix: Boolean,
  duration: Number,
  sortBy: Number,
  links: Object,
  disabled: Boolean
})

schema.statics.getAll = cb => Model.find().sort(sorting).exec(cb)
schema.statics.getOne = (name, cb) => Model.findOne({ name: name }).exec(cb)
schema.statics.getOneBy = (condition, cb) => Model.findOne(condition).exec(cb)
schema.statics.removeOne = (name, cb) => Model.findOneAndRemove({ name: name }).exec(cb)

const Model = mongoose.model('Configs', schema)
module.exports = Model
