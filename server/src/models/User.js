'use strict'

const mongoose = require('mongoose')
const crypto = require('crypto')
const cipher = crypto.createCipher(CONFIG.algorithm, CONFIG.key)

var schema = mongoose.Schema({
  username: String,
  password: String,
  displayName: String
})

schema.statics.findByLogin = (username, cb) => {
  Model.findOne({ username: username }, (err, result) => {
    if (err) {
      return log.error(err)
    }
    cb(result)
  })
}

schema.statics.saveUser = function (obj, cb) {
  Model.findByLogin(obj.username, result => {
    if (result !== null) {
      return cb(true, 'User already exists.')
    }
    let user = new Model(obj)
    user.password = encryptPassword(user.password)
    user.save(cb)
  })
}

function encryptPassword (pwd) {
  return cipher.update(pwd, 'utf8', 'hex') + cipher.final('hex')
}

const Model = mongoose.model('Users', schema)
module.exports = Model