import mongoose from 'mongoose'
const { Schema } = mongoose

const sorting = { sortBy: 1 }

const schema = new Schema(
  {
    name: { type: String, unique: true, required: true, dropDups: true },
    integration: Object,
    type: String,
    hostname: String,
    dbName: String,
    dbVersion: String,
    dbHostname: String,
    osNameExt: String,
    browser: String,
    isNix: Boolean,
    duration: Number,
    sortBy: Number,
    links: Object,
    disabled: Boolean,
    timestamp: Number,
  },
  {
    statics: {
      async getAll() {
        return this.find(sorting)
      },
    },
  }
)

export const ConfigsModel = mongoose.model('Configs', schema)
