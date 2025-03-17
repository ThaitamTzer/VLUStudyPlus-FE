export type CommitmentFormType = {
  _id: string
  name: string
  classId: {
    _id: string
    classId: string
  }
  idOfStudent: string
  approved: {
    approveStatus: 'approved' | 'pending' | 'rejected'
    date: string | Date
    decisionBy: string
    description: string
  }
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

export type CommitmentForm = {
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
  insertSignature: string
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
  approved: {
    approveStatus: 'approved' | 'pending' | 'rejected'
    date: string | Date
    decisionBy: string
    description: string
  }
  commitment: true
  processId: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type ComimentFormDetailType = {
  commitmentForm: CommitmentForm
  academicSession: {
    _id: string
    title: string
  }
}
