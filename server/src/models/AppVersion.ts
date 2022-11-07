import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema({
  major: { type: Number, required: true },
  minor: { type: Number, required: true },
})

export const AppVersionModel = mongoose.model('AppVersion', schema)
