import { HomeLinksModel } from '../models/HomeLinks.js'

type DataProps = Partial<IHomeLinkRecord>

export const homeLinkActions: CreateUpdateDeleteActions = {
  filter(data: DataProps) {
    const filter: DataProps = {}
    if (data._id) {
      filter._id = data._id
    } else {
      filter.name = data.name
    }
    return filter
  },
  async createOrUpdate(data: DataProps) {
    data.timestamp = new Date().getTime()

    const result = await HomeLinksModel.findOneAndUpdate(this.filter(data), data, {
      new: true,
      upsert: true,
    })

    return result
  },
  async remove(data: DataProps) {
    return HomeLinksModel.findOneAndDelete(this.filter(data))
  },
}
