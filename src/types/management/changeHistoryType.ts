type CategoryChange = {
  oldValue: string
  newValue: string
  oldCredits: number
  newCredits: number
  _id: string
}

type SubjectChange = {
  idOfSubject: string
  nameOfSubject: string
  change: string
  _id: string
}

type DeletedSubject = {
  idOfSubject: string
  nameOfSubject: string
  reason: string
  _id: string
}

type DeletedCategory = {
  categoryD: string
  reason: string
  _id: string
}

type NewSubject = {
  idOfSubject: string
  nameOfSubject: string
  _id: string
}

export type Edit = {
  userId: string
  userName: string
  newC: string[]
  newS: NewSubject[]
  changesC: CategoryChange[]
  changesS: SubjectChange[]
  deleteC: DeletedCategory[]
  deleteS: DeletedSubject[]
  editAt: string | Date
  _id: string
}

export type ChangeHistory = {
  _id: string
  trainingProgramSessionId: {
    _id: string
    title: string
    credit: number
  }
  userId: string
  userName: string
  edit: Edit[]
}
