import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema(
  {
    number: String,
    package: String,
    integration: { type: String, unique: true, required: true, dropDups: true },
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

export const BuildsModel = mongoose.model('Builds', schema)
