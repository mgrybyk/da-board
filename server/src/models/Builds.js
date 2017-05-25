'use strict'

var mongoose = require('mongoose')

var schema = mongoose.Schema({
  number: String,
  package: String,
  integration: { type: String, unique: true, required: true, dropDups: true }
})

schema.statics.getAll = cb => Model.find().exec(cb)
schema.statics.getOne = (integration, cb) => Model.findOne({ integration: integration }).exec(cb)
schema.statics.getOneBy = (condition, cb) => Model.findOne(condition).exec(cb)
schema.statics.removeOne = (integration, cb) => Model.findOneAndRemove({ integration: integration }).exec(cb)

const Model = mongoose.model('Builds', schema)
module.exports = Model
