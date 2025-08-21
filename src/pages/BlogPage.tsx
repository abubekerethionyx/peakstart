import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';

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

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "5 Essential Tips for Planning Your Home Renovation",
      excerpt: "Planning a home renovation can be overwhelming. Here are five essential tips to help you navigate the process successfully and avoid common pitfalls.",
      content: "Full article content here...",
      author: "Sarah Thompson",
      publishDate: "January 15, 2025",
      category: "Renovation",
      image: "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "The Future of Sustainable Construction",
      excerpt: "Explore the latest trends in sustainable construction and how green building practices are shaping the industry's future.",
      content: "Full article content here...",
      author: "Michael Rodriguez",
      publishDate: "January 10, 2025",
      category: "Sustainability",
      image: "https://images.pexels.com/photos/3862618/pexels-photo-3862618.jpeg",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Modern Office Spaces: Design Trends for 2025",
      excerpt: "Discover the latest design trends shaping modern office spaces and how they impact productivity and employee satisfaction.",
      content: "Full article content here...",
      author: "Emily Chen",
      publishDate: "January 5, 2025",
      category: "Design",
      image: "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Construction Safety: Best Practices and Innovations",
      excerpt: "Learn about the latest safety innovations and best practices that are making construction sites safer for workers.",
      content: "Full article content here...",
      author: "David Williams",
      publishDate: "December 28, 2024",
      category: "Safety",
      image: "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg",
      readTime: "8 min read"
    },
    {
      id: 5,
      title: "Smart Building Technology Integration",
      excerpt: "How smart building technologies are revolutionizing the construction industry and improving building efficiency.",
      content: "Full article content here...",
      author: "John Mitchell",
      publishDate: "December 20, 2024",
      category: "Technology",
      image: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg",
      readTime: "9 min read"
    },
    {
      id: 6,
      title: "Project Management Best Practices",
      excerpt: "Essential project management techniques that ensure construction projects are completed on time and within budget.",
      content: "Full article content here...",
      author: "Lisa Anderson",
      publishDate: "December 15, 2024",
      category: "Management",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      readTime: "6 min read"
    }
  ];

  const categories = ['All', 'Renovation', 'Sustainability', 'Design', 'Safety', 'Technology', 'Management'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">BuildCorp Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest construction industry trends, tips, and insights 
            from our team of experts.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                      Featured
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {filteredPosts[0].category}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {filteredPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{filteredPosts[0].author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{filteredPosts[0].publishDate}</span>
                      </div>
                      <span>{filteredPosts[0].readTime}</span>
                    </div>
                    <Link
                      to={`/blog/${filteredPosts[0].id}`}
                      className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{post.publishDate}</span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No articles found matching your search criteria.
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-blue-900 text-white rounded-lg p-8 text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-6 text-gray-300">
            Subscribe to our newsletter for the latest construction industry insights and company updates.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-l-lg border-none focus:ring-2 focus:ring-orange-500 text-gray-900"
            />
            <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-r-lg font-medium transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;