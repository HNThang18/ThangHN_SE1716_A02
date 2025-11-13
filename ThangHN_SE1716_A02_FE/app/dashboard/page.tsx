'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  FolderOpen, 
  Tags, 
  Users, 
  Menu,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authService } from '@/services/auth.service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Sidebar from '@/components/Sidebar'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      console.log('Current User:', currentUser)
      console.log('User Role:', currentUser.role, 'Type:', typeof currentUser.role)
      setUser(currentUser)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold">Dashboard</h2>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Welcome back!</h3>
            <p className="text-gray-500">Here&apos;s what&apos;s happening with your news management system.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with these common tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* News Articles - Available to all roles */}
              <Link href="/dashboard/news-articles">
                <Button variant="outline" className="w-full justify-start h-auto py-4 flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span className="font-semibold">News Articles</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Create and manage news articles</span>
                </Button>
              </Link>

              {/* Categories - Staff only */}
              {user?.role === 1 && (
                <Link href="/dashboard/categories">
                  <Button variant="outline" className="w-full justify-start h-auto py-4 flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" />
                      <span className="font-semibold">Categories</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Organize articles by category</span>
                  </Button>
                </Link>
              )}

              {/* Tags - Staff only */}
              {user?.role === 1 && (
                <Link href="/dashboard/tags">
                  <Button variant="outline" className="w-full justify-start h-auto py-4 flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <Tags className="h-5 w-5" />
                      <span className="font-semibold">Tags</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Manage article tags</span>
                  </Button>
                </Link>
              )}

              {/* Accounts - Admin only */}
              {(user?.role === 0 || user?.role === '0') && (
                <Link href="/dashboard/accounts">
                  <Button variant="outline" className="w-full justify-start h-auto py-4 flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span className="font-semibold">User Accounts</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Manage system users and roles</span>
                  </Button>
                </Link>
              )}

              {/* Reports - Admin only */}
              {(user?.role === 0 || user?.role === '0') && (
                <Link href="/dashboard/reports">
                  <Button variant="outline" className="w-full justify-start h-auto py-4 flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      <span className="font-semibold">News Reports</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Generate statistics and reports</span>
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
