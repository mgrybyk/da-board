import mongoose from 'mongoose'
const { Schema } = mongoose

const limitWeek = 50
const limitMonth = 150
const limitQuarter = 250
const limitHalf = 900
const sorting: { timestamp: mongoose.SortOrder } = { timestamp: -1 }

const schema = new Schema(
  {
    timestamp: { type: Number, unique: true, required: true, dropDups: true },
    name: String,
    link: String,
    integration: String,
    test: Object,
    build: Object,
    config: Object,
    allureVersion: String,
  },
  {
    statics: {
      async getAll() {
        return this.find()
      },
      async getOne(timestamp: number) {
        return this.findOne({ timestamp: timestamp })
      },
      async getPeriodResults(period: string) {
        if (period === '1') {
          return this.find().sort(sorting).limit(limitWeek)
        } else if (period === '2') {
          return this.find().sort(sorting).limit(limitMonth).skip(limitWeek)
        } else if (period === '3') {
          return this.find()
            .sort(sorting)
            .limit(limitQuarter)
            .skip(limitMonth + limitWeek)
        } else if (period === '4') {
          return this.find()
            .sort(sorting)
            .limit(limitHalf)
            .skip(limitQuarter + limitMonth + limitWeek)
        } else if (period === '5') {
          return this.find()
            .sort(sorting)
            .skip(limitHalf + limitQuarter + limitMonth + limitWeek)
        } else if (period === '0') {
          return this.find().sort(sorting)
        }

        throw new Error(`Unknown period: ${period}`)
      },
    },
  }
)

export const ResultsModel = mongoose.model('Results', schema)
