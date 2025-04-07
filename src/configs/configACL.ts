interface ACLConfig {
  [key: string]: {
    action: string
    subject: string
  }
}

export const aclConfig: ACLConfig = {
  'term-management': {
    action: 'read',
    subject: 'term'
  },
  '/cohort-management': {
    action: 'read',
    subject: 'cohort'
  },
  '/major-management': {
    action: 'read',
    subject: 'major'
  },
  '/type-process': {
    action: 'read',
    subject: 'typeProcessing'
  },
  '/process-result': {
    action: 'read',
    subject: 'processingResult'
  },
  '/role-management': {
    action: 'read',
    subject: 'role'
  },
  '/lecturer-management': {
    action: 'read',
    subject: 'lecturer'
  },
  '/student-management': {
    action: 'read',
    subject: 'student'
  },
  '/class-management': {
    action: 'read',
    subject: 'class'
  },
  '/classLecturer': {
    action: 'read',
    subject: 'class'
  },
  '/classStudent': {
    action: 'read',
    subject: 'student'
  },
  '/learning-processing': {
    action: 'read',
    subject: 'academicSession'
  },
  '/commitment-forms': {
    action: 'read',
    subject: 'commitment-form'
  },
  '/student-acedemic-process': {
    action: 'readmyprocess',
    subject: 'academic'
  },
  '/training-program': {
    action: 'read',
    subject: 'trainingProgram'
  }
}
