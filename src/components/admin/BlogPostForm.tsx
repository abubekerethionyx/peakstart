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
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {editingBlogPostId ? 'Edit Blog Post' : 'Add New Blog Post'}
      </h2>
      {message && (
        <div className={`p-3 rounded-md mb-4 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}
      <form onSubmit={editingBlogPostId ? handleUpdateSubmit : handleAddSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows={2}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={5}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">Publish Date</label>
          <input
            type="text"
            id="publishDate"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., January 15, 2025"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">Read Time (e.g., 5 min read)</label>
          <input
            type="text"
            id="readTime"
            name="readTime"
            value={formData.readTime}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingBlogPostId ? 'Update Blog Post' : 'Add Blog Post'}
          </button>
          {editingBlogPostId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="ml-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Existing Blog Posts</h3>
        {loading ? (
          <p>Loading blog posts...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : blogPosts.length === 0 ? (
          <p>No blog posts added yet.</p>
        ) : (
          <div className="overflow-x-auto">
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
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.publishDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><img src={post.image} alt={post.title} className="h-10 w-10 object-cover" /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(post)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
