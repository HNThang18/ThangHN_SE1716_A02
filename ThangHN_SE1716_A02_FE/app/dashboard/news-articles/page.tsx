'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/sonner'
import { Plus, Pencil, Trash2, Search, Menu } from 'lucide-react'
import { newsArticleService } from '@/services/newsArticle.service'
import { categoryService } from '@/services/category.service'
import { tagService } from '@/services/tag.service'
import { authService } from '@/services/auth.service'
import { NewsArticle, Category, Tag } from '@/types'
import { format } from 'date-fns'
import Sidebar from '@/components/Sidebar'

export default function NewsArticlesPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    newsTitle: '',
    headline: '',
    newsContent: '',
    newsSource: '',
    categoryId: '',
    newsStatus: true,
    tags: [] as number[]
  })

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    loadArticles(currentUser)
    loadCategories()
    loadTags()
  }, [])

  const loadArticles = async (currentUser?: any) => {
    try {
      const userToCheck = currentUser || user
      if (userToCheck?.role === 1) {
        const response = await newsArticleService.getMyArticles()
        setArticles(response.data || [])
      } else {
        const response = await newsArticleService.getAll()
        setArticles(response.data || [])
      }
    } catch (error) {
      toast.error('Failed to load news articles')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll()
      setCategories(response.data || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadTags = async () => {
    try {
      const response = await tagService.getAll()
      setTags(response.data || [])
    } catch (error) {
      console.error('Failed to load tags:', error)
    }
  }

  const handleCreate = () => {
    setEditingArticle(null)
    setFormData({
      newsTitle: '',
      headline: '',
      newsContent: '',
      newsSource: '',
      categoryId: '',
      newsStatus: true,
      tags: []
    })
    setDialogOpen(true)
  }

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article)
    setFormData({
      newsTitle: article.newsTitle,
      headline: article.headline,
      newsContent: article.newsContent || '',
      newsSource: article.newsSource || '',
      categoryId: article.categoryId.toString(),
      newsStatus: article.newsStatus,
      tags: article.tags?.map(t => t.tagId) || []
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.newsTitle || !formData.headline || !formData.categoryId) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const articleData = {
        newsTitle: formData.newsTitle,
        headline: formData.headline,
        newsContent: formData.newsContent,
        newsSource: formData.newsSource,
        categoryId: parseInt(formData.categoryId),
        newsStatus: formData.newsStatus
      }

      if (editingArticle) {
        await newsArticleService.update(editingArticle.newsArticleId, {
          ...articleData,
          newsArticleId: editingArticle.newsArticleId
        })
        toast.success('News article updated successfully')
      } else {
        await newsArticleService.create(articleData)
        toast.success('News article created successfully')
      }
      
      setDialogOpen(false) // This will trigger onOpenChange which calls handleCloseDialog
      loadArticles(user)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save news article')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this news article?')) return
    
    try {
      await newsArticleService.delete(id)
      toast.success('News article deleted successfully')
      loadArticles(user)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete news article')
    }
  }

  const handleSearch = async () => {
    if (!searchTerm) {
      loadArticles(user)
      return
    }

    try {
      const response = await newsArticleService.search(searchTerm)
      // If staff, filter to only show their own articles
      if (user?.role === 1) {
        const myArticles = (response.data || []).filter((article: NewsArticle) => article.createdById === user.id)
        setArticles(myArticles)
      } else {
        setArticles(response.data || [])
      }
    } catch (error) {
      toast.error('Search failed')
    }
  }

  const toggleTagSelection = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }))
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
            <h2 className="text-xl font-semibold">News Articles Management</h2>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>News Articles</CardTitle>
              {/* Only Staff can create articles */}
              {user?.role === 1 && (
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Article
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button onClick={() => loadArticles(user)} variant="outline">
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
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.newsArticleId}>
                        <TableCell>{article.newsArticleId}</TableCell>
                        <TableCell className="max-w-xs truncate">{article.newsTitle}</TableCell>
                        <TableCell>{article.category?.categoryName || 'N/A'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${article.newsStatus ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {article.newsStatus ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {article.createdDate ? format(new Date(article.createdDate), 'MMM dd, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {/* Only Staff can edit/delete articles */}
                          {user?.role === 1 && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(article.newsArticleId)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? 'Edit News Article' : 'Create News Article'}</DialogTitle>
            <DialogDescription>
              {editingArticle ? 'Update news article information and content' : 'Create a new news article with title, content, category and tags'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.newsTitle}
                onChange={(e) => setFormData({ ...formData, newsTitle: e.target.value })}
                placeholder="Enter article title"
                autoComplete="off"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="headline">Headline *</Label>
              <Input
                id="headline"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="Enter headline"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.newsContent}
                onChange={(e) => setFormData({ ...formData, newsContent: e.target.value })}
                placeholder="Enter article content"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={formData.newsSource}
                onChange={(e) => setFormData({ ...formData, newsSource: e.target.value })}
                placeholder="Enter news source"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.tagId}
                    type="button"
                    onClick={() => toggleTagSelection(tag.tagId)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.tags.includes(tag.tagId)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.tagName}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="status"
                checked={formData.newsStatus}
                onChange={(e) => setFormData({ ...formData, newsStatus: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="status" className="cursor-pointer">Active Status</Label>
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
