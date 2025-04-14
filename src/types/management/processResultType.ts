export type ProcessResultType = {
  _id: string
  processingResultName: string
  formTemplateId: {
    _id: string
    title: string
  }
  commitment: boolean
  createdAt: string | Date
  updatedAt: string | Date
}
