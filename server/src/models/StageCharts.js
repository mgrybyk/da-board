'use strict'

const mongoose = require('mongoose')

var schema = mongoose.Schema({
  name: { type: String, unique: true, required: true, dropDups: true },
  isChart: Boolean
})

schema.statics.getAll = cb => Model.find().exec(cb)
schema.statics.getOne = (name, cb) => Model.findOne({ name: name }).exec(cb)

const Model = mongoose.model('StageCharts', schema)
module.exports = Model
