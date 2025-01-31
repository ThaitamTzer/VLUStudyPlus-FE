export type Role = {
  _id: string
  name: string
  permissionID: number[]
  icon: string
  color: string
}

export type RoleType = {
  data: {
    total: number
    roles: Role[]
  }
}

export type AddRoleType = {
  name: string
  permissionID: number[]
  icon: string | undefined
  color: string | undefined
}

export type UpdateRoleType = {
  _id: string
  name: string
  permissionID: number
  icon: string
  color: string
}
