import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema(
  {
    name: { type: String, unique: true, required: true, dropDups: true },
    flag: Boolean,
    value: Object,
    timestamp: Number,
  },
  {
    statics: {
      async getAll() {
        return this.find()
      },
    },
  }
)

export const SettingsModel = mongoose.model('Settings', schema)
