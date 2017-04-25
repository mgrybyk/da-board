'use strict'

const mongoose = require('mongoose')
const crypto = require('crypto')

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

schema.statics.getAll = cb => Model.find({}, { username: 1, displayName: 1 }).exec(cb)

function encryptPassword (pwd) {
  let cipher = crypto.createCipher(CONFIG.algorithm, CONFIG.key)
  return cipher.update(pwd, 'utf8', 'hex') + cipher.final('hex')
}

const Model = mongoose.model('Users', schema)
module.exports = Model
