import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema<IHomeLink>(
  {
    name: { type: String, unique: true, required: true, dropDups: true },
    link: String,
    details: String,
    group: String,
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

export const HomeLinksModel = mongoose.model('HomeLinks', schema)
