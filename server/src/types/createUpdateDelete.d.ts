interface CreateUpdateDeleteActions {
  filter: (data: Record<string, unknown>) => Record<string, unknown>
  createOrUpdate: (data: Record<string, unknown>) => Promise<mongoose.Document>
  remove: (data: Record<string, unknown>) => Promise<mongoose.Document>
}
