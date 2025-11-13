import api from '@/lib/api'
import { ApiResponse, NewsArticle } from '@/types'

export const newsArticleService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<NewsArticle[]>>('/newsarticles')
    return response.data
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<NewsArticle>>(`/newsarticles/${id}`)
    return response.data
  },

  create: async (article: Partial<NewsArticle>) => {
    const response = await api.post<ApiResponse<NewsArticle>>('/newsarticles', article)
    return response.data
  },

  update: async (id: number, article: Partial<NewsArticle>) => {
    const response = await api.put<ApiResponse<NewsArticle>>(`/newsarticles/${id}`, article)
    return response.data
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse>(`/newsarticles/${id}`)
    return response.data
  },

  search: async (title?: string, categoryId?: number, tagName?: string) => {
    const params = new URLSearchParams()
    if (title) params.append('title', title)
    if (categoryId) params.append('categoryId', categoryId.toString())
    if (tagName) params.append('tagName', tagName)
    
    const response = await api.get<ApiResponse<NewsArticle[]>>(`/newsarticles/search?${params}`)
    return response.data
  },

  getReport: async (startDate: string, endDate: string) => {
    const response = await api.get<ApiResponse<NewsArticle[]>>(
      `/newsarticles/report?startDate=${startDate}&endDate=${endDate}`
    )
    return response.data
  },

  getMyArticles: async () => {
    const response = await api.get<ApiResponse<NewsArticle[]>>('/newsarticles/my-articles')
    return response.data
  },
}
