export type MailHistoryTypeForCHVT = {
  _id: string
  emailTo: string[]
  subject: string
  content: string
  createdAt: Date | string
  updatedAt: Date | string
}

export type MailHistoryType = {
  _id: string
  emailTo: string[]
  subject: string
  content: string
  senderId: {
    _id: string
    userName: string
    mail: string
  }
  createdAt: Date | string
  updatedAt: Date | string
}
