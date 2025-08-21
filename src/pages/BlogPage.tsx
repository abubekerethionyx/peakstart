import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { getBlogPosts, getBlogCategories } from '../services/api';

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

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch categories
        const categoryResponse = await getBlogCategories();
        if (categoryResponse.success) {
          setCategories(['All', ...(categoryResponse.data || [])]);
        } else {
          console.error('Failed to fetch categories:', categoryResponse.error);
        }

        // Fetch blog posts
        const postResponse = await getBlogPosts(selectedCategory, searchTerm);
        if (postResponse.success) {
          setBlogPosts(postResponse.data || []);
        } else {
          setError(postResponse.error || 'Failed to fetch blog posts');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [selectedCategory, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Blog</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest news, insights, and trends in the
            construction industry from our expert team.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <Link to={`/blog/${post.id}`}>
                <img
                  src={post.image}
                  alt={post.title}
                        className="w-full h-64 object-cover"
                />
                    </Link>
                    <div className="p-6">
                      <div className="text-sm text-orange-600 font-semibold mb-2">
                    {post.category}
                </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        <Link
                          to={`/blog/${post.id}`}
                          className="hover:text-orange-600 transition-colors duration-200"
                        >
                  {post.title}
                        </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <User className="w-4 h-4 mr-2" />
                    <span>{post.author}</span>
                        <Calendar className="w-4 h-4 mr-2 ml-4" />
                    <span>{post.publishDate}</span>
                        <span className="ml-4">{post.readTime}</span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                        className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
                  >
                    <span>Read More</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
                ))
              ) : (
                <p className="text-gray-700">No blog posts found.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Search Bar */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Search Blog</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Categories</h3>
              <ul>
                {categories.map((category) => (
                  <li key={category} className="mb-2">
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200
                        ${selectedCategory === category
                          ? 'bg-blue-100 text-blue-800 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
        </div>

            {/* Recent Posts (Placeholder) */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Posts</h3>
              <ul className="space-y-4">
                {blogPosts.slice(0, 3).map((post) => (
                  <li key={post.id}>
                    <Link to={`/blog/${post.id}`} className="flex items-center space-x-4 group">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div>
                        <p className="text-gray-800 font-medium group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                          {post.title}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {post.publishDate}
            </p>
          </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;