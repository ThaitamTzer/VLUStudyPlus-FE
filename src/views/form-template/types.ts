export interface Field {
  label: string
  key: string
  type: string
  row: number
  column: number
  required: boolean
  signatureType?: string
}

export interface Section {
  sectionTitle: string
  fields: Field[]
}

export interface FormTemplate {
  _id?: string
  title: string
  documentCode: string
  recipient: string[]
  description: string
  sections: Section[]
}
