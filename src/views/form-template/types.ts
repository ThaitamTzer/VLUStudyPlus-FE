export interface Field {
  label: string
  key: string
  type: string
  row: number
  column: number
  required: boolean
  signatureType?: string
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
}

export interface Section {
  id?: string
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
