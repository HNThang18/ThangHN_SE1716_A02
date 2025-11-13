export interface ApiResponse<T = any> {
  message: string
  code: string
  data?: T
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface SystemAccount {
  accountId: number
  accountName: string
  accountEmail: string
  accountRole: number
  accountPassword?: string
}

export interface Category {
  categoryId: number
  categoryName: string
  categoryDescription?: string
}

export interface Tag {
  tagId: number
  tagName: string
  note?: string
}

export interface NewsArticle {
  newsArticleId: number
  newsTitle: string
  headline: string
  createdDate: string
  newsContent?: string
  newsSource?: string
  categoryId: number
  newsStatus: boolean
  createdById: number
  updatedById?: number
  modifiedDate?: string
  category?: Category
  createdBy?: SystemAccount
  updatedBy?: SystemAccount
  tags?: Tag[]
}

export enum UserRole {
  Admin = 0,
  Staff = 1
}

export function getRoleName(role: number | string): string {
  const roleNum = typeof role === 'string' ? parseInt(role) : role
  switch (roleNum) {
    case UserRole.Admin:
      return 'Admin'
    case UserRole.Staff:
      return 'Staff'
    default:
      return 'Unknown'
  }
}
