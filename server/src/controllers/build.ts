import { BuildsModel } from '../models/Builds.js'

type DataProps = Partial<IBuildRecord>

export const buildActions: CreateUpdateDeleteActions = {
  filter(data: DataProps) {
    const filter: DataProps = {}
    if (data._id) {
      filter._id = data._id
    } else {
      filter.integration = data.integration
    }
    return filter
  },
  async createOrUpdate(data: DataProps) {
    data.timestamp = new Date().getTime()

    const result = await BuildsModel.findOneAndUpdate(this.filter(data), data, {
      new: true,
      upsert: true,
    })

    return result
  },
  async remove(data: DataProps) {
    return BuildsModel.findOneAndDelete(this.filter(data))
  },
}
