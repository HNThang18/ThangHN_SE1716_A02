'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/sonner'
import { Plus, Pencil, Trash2, Search, Menu } from 'lucide-react'
import { tagService } from '@/services/tag.service'
import { Tag } from '@/types'
import Sidebar from '@/components/Sidebar'

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({ tagName: '', note: '' })

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      const response = await tagService.getAll()
      setTags(response.data || [])
    } catch (error) {
      toast.error('Failed to load tags')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingTag(null)
    setFormData({ tagName: '', note: '' })
    setDialogOpen(true)
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setFormData({
      tagName: tag.tagName,
      note: tag.note || ''
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.tagName) {
      toast.error('Tag name is required')
      return
    }

    try {
      if (editingTag) {
        // Include tagId in the update payload
        const updateData = {
          tagId: editingTag.tagId,
          ...formData
        }
        await tagService.update(editingTag.tagId, updateData)
        toast.success('Tag updated successfully')
      } else {
        await tagService.create(formData)
        toast.success('Tag created successfully')
      }
      setDialogOpen(false) // This will trigger onOpenChange which calls handleCloseDialog
      loadTags()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save tag')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tag?')) return
    
    try {
      await tagService.delete(id)
      toast.success('Tag deleted successfully')
      loadTags()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete tag')
    }
  }

  const handleSearch = async () => {
    if (!searchTerm) {
      loadTags()
      return
    }

    try {
      const response = await tagService.search(searchTerm)
      setTags(response.data || [])
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
            <h2 className="text-xl font-semibold">Tags Management</h2>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Tags</CardTitle>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Tag
              </Button>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button onClick={loadTags} variant="outline">
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
                      <TableHead>Tag Name</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags.map((tag) => (
                      <TableRow key={tag.tagId}>
                        <TableCell>{tag.tagId}</TableCell>
                        <TableCell>{tag.tagName}</TableCell>
                        <TableCell>{tag.note}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(tag)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(tag.tagId)}>
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
            <DialogTitle>{editingTag ? 'Edit Tag' : 'Create Tag'}</DialogTitle>
            <DialogDescription>
              {editingTag ? 'Update tag information' : 'Add a new tag to categorize news articles'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tag Name *</Label>
              <Input
                id="name"
                value={formData.tagName}
                onChange={(e) => setFormData({ ...formData, tagName: e.target.value })}
                placeholder="Enter tag name"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Enter note"
                autoComplete="off"
              />
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
