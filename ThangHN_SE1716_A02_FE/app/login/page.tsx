'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authService } from '@/services/auth.service'
import { toast } from '@/components/ui/sonner'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  nameid: string
  email: string
  role: string
  exp: number
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.login(formData)
      
      if (response.data?.token) {
        // Decode JWT token to get user info
        const decoded = jwtDecode<any>(response.data.token)
        console.log('Decoded JWT Token - Full Object:', JSON.stringify(decoded, null, 2))
        console.log('All JWT Properties:', Object.keys(decoded))
        console.log('decoded.role:', decoded.role)
        console.log('decoded[\'http://schemas.microsoft.com/ws/2008/06/identity/claims/role\']:', decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
        
        // Try to get role from various possible claim names
        const roleValue = decoded.role || 
                         decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
                         decoded['role'] ||
                         decoded['Role']
        
        const user = {
          id: decoded.nameid || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          role: parseInt(roleValue),
        }
        
        console.log('User Object:', user)

        // Store token and user info
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(user))

        toast.success('Login successful!')
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">FU News Management</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="text-center">Demo accounts:</p>
            <p className="text-center">Admin: admin@FUNewsManagementSystem.org / @@abc123@@</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
