import axiosClient from '@/libs/axios'
import type { RoleType, AddRoleType, UpdateRoleType } from '@/types/management/roleType'

const roleService = {
  getAll: async (page?: number, limit?: number, searchKey?: string) => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(searchKey && { searchKey })
    }

    const response = await axiosClient.get('/api/role', { params })

    return response.data as RoleType
  },

  create: async (data: AddRoleType, successCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/role', data).then(res => {
        if (successCallback) {
          successCallback(res)
        }

        return res
      })
    } catch (error) {
      if (errorCallback) {
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  },

  update: async (data: UpdateRoleType, successCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.put('/api/role', data).then(res => {
        if (successCallback) {
          successCallback(res)
        }

        return res
      })
    } catch (error) {
      if (errorCallback) {
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  },

  delete: async (id: string, successCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.delete('/api/role', { data: { id } }).then(res => {
        if (successCallback) {
          successCallback(res)
        }

        return res
      })
    } catch (error) {
      if (errorCallback) {
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  }
}

export default roleService
