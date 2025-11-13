import api from '@/lib/api'
import { ApiResponse, Category } from '@/types'

export const categoryService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Category[]>>('/categories')
    return response.data
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`)
    return response.data
  },

  create: async (category: Partial<Category>) => {
    const response = await api.post<ApiResponse<Category>>('/categories', category)
    return response.data
  },

  update: async (id: number, category: Partial<Category>) => {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, category)
    return response.data
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse>(`/categories/${id}`)
    return response.data
  },

  search: async (name?: string) => {
    const params = name ? `?name=${name}` : ''
    const response = await api.get<ApiResponse<Category[]>>(`/categories/search${params}`)
    return response.data
  },
}
