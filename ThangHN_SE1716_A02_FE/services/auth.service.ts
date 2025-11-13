import api from '@/lib/api'
import { ApiResponse, LoginRequest, LoginResponse } from '@/types'

export const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}
