"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createBlogPost, getBlogPosts, updateBlogPost, deleteBlogPost } from "../../services/api"
import AdminModal from "./AdminModal"
import AdminTable from "./AdminTable"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  category: string
  image: string
  readTime: string
}

const BlogPostForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    publishDate: "",
    category: "",
    image: "",
    readTime: "",
  })
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingBlogPostId, setEditingBlogPostId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchBlogPosts = async () => {
    setLoading(true)
    setError(null)
    const response = await getBlogPosts()
    if (response.success && response.data) {
      setBlogPosts(response.data)
    } else {
      setError(response.error || "Failed to fetch blog posts.")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsError(false)

    try {
      const response = await createBlogPost(formData)
      if (response.success) {
        setMessage(response.message || "Blog post created successfully!")
        setFormData({
          title: "",
          excerpt: "",
          content: "",
          author: "",
          publishDate: "",
          category: "",
          image: "",
          readTime: "",
        })
        fetchBlogPosts() // Refresh the list
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to create blog post.")
      }
    } catch (err: any) {
      setIsError(true)
      setMessage(err.message || "An unexpected error occurred.")
    }
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsError(false)

    if (editingBlogPostId === null) {
      setIsError(true)
      setMessage("No blog post selected for update.")
      return
    }

    try {
      const response = await updateBlogPost(editingBlogPostId, formData)
      if (response.success) {
        setMessage(response.message || "Blog post updated successfully!")
        setFormData({
          title: "",
          excerpt: "",
          content: "",
          author: "",
          publishDate: "",
          category: "",
          image: "",
          readTime: "",
        })
        setEditingBlogPostId(null) // Exit edit mode
        fetchBlogPosts() // Refresh the list
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to update blog post.")
      }
    } catch (err: any) {
      setIsError(true)
      setMessage(err.message || "An unexpected error occurred.")
    }
  }

  const handleEdit = (blogPost: BlogPost) => {
    setEditingBlogPostId(blogPost.id)
    setFormData({
      title: blogPost.title,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      author: blogPost.author,
      publishDate: blogPost.publishDate,
      category: blogPost.category,
      image: blogPost.image,
      readTime: blogPost.readTime,
    })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingBlogPostId(null)
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      publishDate: "",
      category: "",
      image: "",
      readTime: "",
    })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleDelete = async (blogPostId: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const response = await deleteBlogPost(blogPostId)
        if (response.success) {
          setMessage(response.message || "Blog post deleted successfully!")
          fetchBlogPosts() // Refresh the list
        } else {
          setIsError(true)
          setMessage(response.error || "Failed to delete blog post.")
        }
      } catch (err: any) {
        setIsError(true)
        setMessage(err.message || "An unexpected error occurred.")
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingBlogPostId(null)
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      publishDate: "",
      category: "",
      image: "",
      readTime: "",
    })
    setMessage(null)
    setIsError(false)
  }

  const categories = ["Renovation", "Sustainability", "Design", "Safety", "Technology", "Management", "Other"]

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Simple Header with Add Button */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Blog Post Management</h1>
              <p className="text-sm text-gray-600 mt-1">Create and manage your blog posts</p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Blog Post
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                isError
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-green-50 border border-green-200 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Enhanced Modal */}
        <AdminModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingBlogPostId ? "Edit Blog Post" : "Create New Blog Post"}
        >
          <form
            onSubmit={(e) => {
              ;(editingBlogPostId ? handleUpdateSubmit : handleAddSubmit)(e)
              setModalOpen(false)
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Blog Post Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter an engaging title for your blog post"
                  required
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-semibold text-gray-700 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Author name"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="publishDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Publish Date
                </label>
                <input
                  type="text"
                  id="publishDate"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="e.g., January 15, 2025"
                  required
                />
              </div>

              <div>
                <label htmlFor="readTime" className="block text-sm font-semibold text-gray-700 mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  id="readTime"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="e.g., 5 min read"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  placeholder="Write a compelling excerpt that summarizes your blog post..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  placeholder="Write your blog post content here..."
                  required
                />
              </div>
            </div>

            <div className="flex justify-center space-x-4 pt-6 border-t border-gray-100">
              <button
                type="submit"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {editingBlogPostId ? "Update Blog Post" : "Create Blog Post"}
              </button>
              {editingBlogPostId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-8 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl shadow-sm hover:shadow-md bg-white hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-500/25"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </AdminModal>

        {/* Table Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-600 font-medium">Error: {error}</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first blog post.</p>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Post
              </button>
            </div>
          ) : (
            <AdminTable
              items={blogPosts}
              columns={[
                {
                  key: "title",
                  label: "Title",
                  render: (item: BlogPost) => (
                    <div className="max-w-xs">
                      <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                      <p className="text-sm text-gray-500 truncate">{item.excerpt}</p>
                    </div>
                  ),
                },
                {
                  key: "author",
                  label: "Author",
                  render: (item: BlogPost) => <span className="font-medium text-gray-900">{item.author}</span>,
                },
                {
                  key: "category",
                  label: "Category",
                  render: (item: BlogPost) => (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  ),
                },
                {
                  key: "publishDate",
                  label: "Published",
                  render: (item: BlogPost) => <span className="text-sm text-gray-600">{item.publishDate}</span>,
                },
                {
                  key: "readTime",
                  label: "Read Time",
                  render: (item: BlogPost) => <span className="text-sm text-gray-500">{item.readTime}</span>,
                },
                {
                  key: "image",
                  label: "Image",
                  render: (item: BlogPost) => (
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="h-12 w-12 object-cover rounded-lg shadow-sm border border-gray-200"
                    />
                  ),
                },
              ]}
              onEdit={(item) => handleEdit(item)}
              onDelete={(id) => handleDelete(id)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogPostForm
