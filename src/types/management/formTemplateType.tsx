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

export type FormTemplateType = {
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
