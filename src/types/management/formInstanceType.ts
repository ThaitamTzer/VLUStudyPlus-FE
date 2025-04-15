export type FieldType = {
  label: string
  key: string
  type: string
  row: number
  column: number
  required: boolean
  _id: string
}

export type SectionType = {
  sectionTitle: string
  fields: FieldType[]
  _id: string
}

export type FormInstanceType = {
  _id: string
  templateId: {
    _id: string
    title: string
    documentCode: string
    recipient: string[]
    description: string
    sections: SectionType[]
    createdAt: string
    updatedAt: string
    __v: number
  }
  createdBy: string
  academicProcessingId: string
  responses: any
  approved: {
    approveStatus: 'pending' | 'approved' | 'rejected'
    date: string | Date
    decisionBy: string | Date
    description: string | Date
    _id: string
  }
  createdAt: string
  updatedAt: string
  __v: number
}
