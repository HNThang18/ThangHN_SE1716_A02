import api from '@/lib/api'
import { ApiResponse, SystemAccount } from '@/types'

export const accountService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<SystemAccount[]>>('/systemaccounts')
    return response.data
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<SystemAccount>>(`/systemaccounts/${id}`)
    return response.data
  },

  create: async (account: Partial<SystemAccount>) => {
    const response = await api.post<ApiResponse<SystemAccount>>('/systemaccounts', account)
    return response.data
  },

  update: async (id: number, account: Partial<SystemAccount>) => {
    const response = await api.put<ApiResponse<SystemAccount>>(`/systemaccounts/${id}`, account)
    return response.data
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse>(`/systemaccounts/${id}`)
    return response.data
  },

  search: async (name?: string, email?: string) => {
    const params = new URLSearchParams()
    if (name) params.append('name', name)
    if (email) params.append('email', email)
    
    const response = await api.get<ApiResponse<SystemAccount[]>>(`/systemaccounts/search?${params}`)
    return response.data
  },
}
