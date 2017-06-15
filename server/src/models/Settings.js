'use strict'

const mongoose = require('mongoose')

var schema = mongoose.Schema({
  name: { type: String, unique: true, required: true, dropDups: true },
  flag: Boolean,
  value: Object,
  timestamp: Number
})

schema.statics.getAll = cb => Model.find().exec(cb)
schema.statics.getOne = (name, cb) => Model.findOne({ name: name }).exec(cb)
schema.statics.getOneBy = (condition, cb) => Model.findOne(condition).exec(cb)

const Model = mongoose.model('Settings', schema)
module.exports = Model
