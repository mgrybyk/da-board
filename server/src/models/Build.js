'use strict'

var mongoose = require('mongoose')

var schema = mongoose.Schema({
  number: String,
  package: String
}, { collection: 'build' })

schema.statics.getOne = cb => Model.findOne().exec(cb)

const Model = mongoose.model('Build', schema)
module.exports = Model
