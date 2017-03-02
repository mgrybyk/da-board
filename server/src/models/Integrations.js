'use strict'

const mongoose = require('mongoose')

var schema = mongoose.Schema({
  name: { type: String, unique: true, required: true, dropDups: true },
  rootUrl: String,
  homeUrl: String, // remove?
  auth: Object,
  run: Object,
  disable: Object,
  abort: Object,
  remote: Object,
  description: String
})

schema.statics.getAll = cb => Model.find().exec(cb)
schema.statics.getOne = (name, cb) => Model.findOne({ name: name }).exec(cb)

const Model = mongoose.model('Integrations', schema)
module.exports = Model
