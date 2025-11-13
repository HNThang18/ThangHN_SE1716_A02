import api from '@/lib/api'
import { ApiResponse, Tag } from '@/types'

export const tagService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Tag[]>>('/tags')
    return response.data
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Tag>>(`/tags/${id}`)
    return response.data
  },

  create: async (tag: Partial<Tag>) => {
    const response = await api.post<ApiResponse<Tag>>('/tags', tag)
    return response.data
  },

  update: async (id: number, tag: Partial<Tag>) => {
    const response = await api.put<ApiResponse<Tag>>(`/tags/${id}`, tag)
    return response.data
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse>(`/tags/${id}`)
    return response.data
  },

  search: async (name?: string) => {
    const params = name ? `?name=${name}` : ''
    const response = await api.get<ApiResponse<Tag[]>>(`/tags/search${params}`)
    return response.data
  },
}
