import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema(
  {
    name: { type: String, unique: true, required: true, dropDups: true },
    displayName: String,
    rootUrl: String,
    processUrlTemplate: String,
    auth: Object,
    headers: Object,
    actions: Object,
    remote: Object,
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

export const IntegrationsModel = mongoose.model('Integrations', schema)
