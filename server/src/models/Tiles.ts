import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema(
  {
    name: { type: String, unique: true, required: true, dropDups: true },
    package: String,
    isFailure: Boolean,
    isCancelled: Boolean,
    isRunning: Boolean,
    startTime: Number,
    stages: Object,
    processId: String,
    processUrl: String,
    disabled: Boolean,
    userFlag: Object,
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

export const TilesModel = mongoose.model('Tiles', schema)
