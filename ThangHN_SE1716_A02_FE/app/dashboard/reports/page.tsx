'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/sonner'
import { Menu, FileText, Download } from 'lucide-react'
import { newsArticleService } from '@/services/newsArticle.service'
import { NewsArticle } from '@/types'
import { format } from 'date-fns'
import Sidebar from '@/components/Sidebar'

export default function ReportsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates')
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date')
      return
    }

    setLoading(true)
    try {
      const response = await newsArticleService.getReport(startDate, endDate)
      setArticles(response.data || [])
      toast.success(`Report generated successfully with ${response.data?.length || 0} articles`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (articles.length === 0) {
      toast.error('No data to export')
      return
    }

    // Create CSV content
    const headers = ['ID', 'Title', 'Headline', 'Category', 'Created By', 'Created Date', 'Status']
    const csvContent = [
      headers.join(','),
      ...articles.map(article => [
        article.newsArticleId,
        `"${article.newsTitle.replace(/"/g, '""')}"`,
        `"${article.headline.replace(/"/g, '""')}"`,
        `"${article.category?.categoryName || 'N/A'}"`,
        `"${article.createdBy?.accountName || 'N/A'}"`,
        article.createdDate ? format(new Date(article.createdDate), 'yyyy-MM-dd') : 'N/A',
        article.newsStatus ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `news_report_${startDate}_to_${endDate}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Report exported successfully')
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
            <h2 className="text-xl font-semibold">News Reports</h2>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Generate News Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleGenerateReport} 
                    disabled={loading}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {loading ? 'Generating...' : 'Generate Report'}
                  </Button>
                  {articles.length > 0 && (
                    <Button 
                      onClick={handleExport} 
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {articles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Report Results ({articles.length} articles)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articles.map((article) => (
                        <TableRow key={article.newsArticleId}>
                          <TableCell>{article.newsArticleId}</TableCell>
                          <TableCell className="max-w-xs truncate">{article.newsTitle}</TableCell>
                          <TableCell>{article.category?.categoryName || 'N/A'}</TableCell>
                          <TableCell>{article.createdBy?.accountName || 'N/A'}</TableCell>
                          <TableCell>
                            {article.createdDate ? format(new Date(article.createdDate), 'MMM dd, yyyy') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${article.newsStatus ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {article.newsStatus ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && articles.length === 0 && startDate && endDate && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No articles found for the selected date range</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
