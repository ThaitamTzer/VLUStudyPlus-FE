export type UserType = {
  _id: string
  userId: string
  classCode: string
  academicYear: string
  userName: string
  cohortId: string
  mail: string
  role: {
    _id: string
    name: string
  }
  avatar: string
  isBlock: boolean
  createdAt: string | Date
  updatedAt: string | Date
  accessTime: string | Date
}
