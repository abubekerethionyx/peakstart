import React, { useState, useEffect } from 'react';
import { createBlogPost, getBlogPosts, updateBlogPost, deleteBlogPost } from '../../services/api';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  image: string;
  readTime: string;
}

const BlogPostForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    publishDate: '',
    category: '',
    image: '',
    readTime: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBlogPostId, setEditingBlogPostId] = useState<number | null>(null);

  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    const response = await getBlogPosts();
    if (response.success && response.data) {
      setBlogPosts(response.data);
    } else {
      setError(response.error || "Failed to fetch blog posts.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      const response = await createBlogPost(formData);
      if (response.success) {
        setMessage(response.message || 'Blog post created successfully!');
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          author: '',
          publishDate: '',
          category: '',
          image: '',
          readTime: '',
        });
        fetchBlogPosts(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to create blog post.');
      }
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    if (editingBlogPostId === null) {
      setIsError(true);
      setMessage('No blog post selected for update.');
      return;
    }

    try {
      const response = await updateBlogPost(editingBlogPostId, formData);
      if (response.success) {
        setMessage(response.message || 'Blog post updated successfully!');
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          author: '',
          publishDate: '',
          category: '',
          image: '',
          readTime: '',
        });
        setEditingBlogPostId(null); // Exit edit mode
        fetchBlogPosts(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to update blog post.');
      }
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const handleEdit = (blogPost: BlogPost) => {
    setEditingBlogPostId(blogPost.id);
    setFormData({
      title: blogPost.title,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      author: blogPost.author,
      publishDate: blogPost.publishDate,
      category: blogPost.category,
      image: blogPost.image,
      readTime: blogPost.readTime,
    });
    setMessage(null);
    setIsError(false);
  };

  const handleDelete = async (blogPostId: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await deleteBlogPost(blogPostId);
        if (response.success) {
          setMessage(response.message || 'Blog post deleted successfully!');
          fetchBlogPosts(); // Refresh the list
        } else {
          setIsError(true);
          setMessage(response.error || 'Failed to delete blog post.');
        }
      } catch (err: any) {
        setIsError(true);
        setMessage(err.message || 'An unexpected error occurred.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingBlogPostId(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      publishDate: '',
      category: '',
      image: '',
      readTime: '',
    });
    setMessage(null);
    setIsError(false);
  };

  const categories = [
    'Renovation',
    'Sustainability',
    'Design',
    'Safety',
    'Technology',
    'Management',
    'Other'
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {editingBlogPostId ? 'Edit Blog Post' : 'Add New Blog Post'}
      </h2>
      {message && (
        <div className={`p-4 rounded-md mb-6 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-center font-medium`}>
          {message}
        </div>
      )}
      <form onSubmit={editingBlogPostId ? handleUpdateSubmit : handleAddSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-1">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={6}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="publishDate" className="block text-sm font-semibold text-gray-700 mb-1">Publish Date</label>
          <input
            type="text"
            id="publishDate"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., January 15, 2025"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="readTime" className="block text-sm font-semibold text-gray-700 mb-1">Read Time (e.g., 5 min read)</label>
          <input
            type="text"
            id="readTime"
            name="readTime"
            value={formData.readTime}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingBlogPostId ? 'Update Blog Post' : 'Add Blog Post'}
          </button>
          {editingBlogPostId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Existing Blog Posts</h3>
        {loading ? (
          <p className="text-center text-gray-600">Loading blog posts...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : blogPosts.length === 0 ? (
          <p className="text-center text-gray-600">No blog posts added yet.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publish Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs overflow-hidden text-ellipsis">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.publishDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={post.image} alt={post.title} className="h-12 w-12 object-cover rounded-md" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(post)} className="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostForm;
