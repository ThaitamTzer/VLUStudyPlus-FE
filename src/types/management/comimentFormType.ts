export type CommitmentFormType = {
  _id: string
  name: string
  classId: {
    _id: string
    classId: string
  }
  idOfStudent: string
  approveStatus: 'approve' | 'pending' | 'reject'
}

export type CommitmentFormListType = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  data: CommitmentFormType[]
}

export type Processing = {
  term: string
  typeProcessing: string
  _id: string
}

export type debt = {
  term: string
  subject: string
  _id: string
}

export type ComimentFormDetailType = {
  commitmentForm: {
    _id: string
    title: string
    lectureId: {
      _id: string
      userName: string
    }
    name: string
    classId: {
      _id: string
      classId: string
    }
    idOfStudent: string
    phoneNumber: string
    phoneNumberParent: string
    averageScore: 7.5
    credit: 120
    processing: Processing[]
    numberOfViolations: 2
    reason: string
    aspiration: string
    debt: [
      {
        term: string
        subject: string
        _id: string
      },
      {
        term: string
        subject: string
        _id: string
      }
    ]
    commitment: true
    processId: string
    approveStatus: 'approve' | 'pending' | 'reject'
    createdAt: string | Date
    updatedAt: string | Date
  }
  academicSession: {
    _id: string
    title: string
  }
}
