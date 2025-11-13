'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/sonner'
import { Plus, Pencil, Trash2, Search, Menu } from 'lucide-react'
import { accountService } from '@/services/account.service'
import { SystemAccount, UserRole, getRoleName } from '@/types'
import Sidebar from '@/components/Sidebar'

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SystemAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<SystemAccount | null>(null)
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    accountName: '',
    accountEmail: '',
    accountPassword: '',
    accountRole: '1'
  })

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const response = await accountService.getAll()
      setAccounts(response.data || [])
    } catch (error) {
      toast.error('Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingAccount(null)
    setFormData({
      accountName: '',
      accountEmail: '',
      accountPassword: '',
      accountRole: '1'
    })
    setDialogOpen(true)
  }

  const handleEdit = (account: SystemAccount) => {
    setEditingAccount(account)
    setFormData({
      accountName: account.accountName,
      accountEmail: account.accountEmail,
      accountPassword: '', // Don't populate password for security
      accountRole: account.accountRole.toString()
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.accountName || !formData.accountEmail) {
      toast.error('Name and email are required')
      return
    }

    if (!editingAccount && !formData.accountPassword) {
      toast.error('Password is required for new accounts')
      return
    }

    try {
      const accountData = {
        accountName: formData.accountName,
        accountEmail: formData.accountEmail,
        accountRole: parseInt(formData.accountRole),
        ...(formData.accountPassword && { accountPassword: formData.accountPassword })
      }

      if (editingAccount) {
        // Include accountId in the update payload
        const updateData = {
          accountId: editingAccount.accountId,
          ...accountData
        }
        await accountService.update(editingAccount.accountId, updateData)
        toast.success('Account updated successfully')
      } else {
        await accountService.create(accountData)
        toast.success('Account created successfully')
      }
      
      setDialogOpen(false) // This will trigger onOpenChange which calls handleCloseDialog
      loadAccounts()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save account')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this account?')) return
    
    try {
      await accountService.delete(id)
      toast.success('Account deleted successfully')
      loadAccounts()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cannot delete account that has created articles')
    }
  }

  const handleSearch = async () => {
    if (!searchName && !searchEmail) {
      loadAccounts()
      return
    }

    try {
      const response = await accountService.search(searchName, searchEmail)
      setAccounts(response.data || [])
    } catch (error) {
      toast.error('Search failed')
    }
  }

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

      <div className="lg:pl-64">
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
            <h2 className="text-xl font-semibold">Accounts Management</h2>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>System Accounts</CardTitle>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Search by name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <Input
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
                <Button onClick={handleSearch} variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button onClick={loadAccounts} variant="outline">
                  Clear
                </Button>
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.accountId}>
                        <TableCell>{account.accountId}</TableCell>
                        <TableCell>{account.accountName}</TableCell>
                        <TableCell>{account.accountEmail}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            account.accountRole === 0 ? 'bg-red-100 text-red-800' :
                            account.accountRole === 1 ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {getRoleName(account.accountRole)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(account)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(account.accountId)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAccount ? 'Edit Account' : 'Create Account'}</DialogTitle>
            <DialogDescription>
              {editingAccount ? 'Update user account information and role' : 'Create a new user account for the system'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                placeholder="Enter full name"
                autoComplete="off"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.accountEmail}
                onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
                placeholder="Enter email address"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password {!editingAccount && '*'}</Label>
              <Input
                id="password"
                type="password"
                value={formData.accountPassword}
                onChange={(e) => setFormData({ ...formData, accountPassword: e.target.value })}
                placeholder={editingAccount ? 'Leave blank to keep current' : 'Enter password'}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.accountRole} onValueChange={(value) => setFormData({ ...formData, accountRole: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Admin</SelectItem>
                  <SelectItem value="1">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
