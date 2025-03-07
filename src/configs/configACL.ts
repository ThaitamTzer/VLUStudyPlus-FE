interface ACLConfig {
  [key: string]: {
    action: string
    subject: string
  }
}

export const aclConfig: ACLConfig = {
  '/role-management': {
    action: 'read',
    subject: 'role'
  }
}
