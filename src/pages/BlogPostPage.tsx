import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock, Share2 } from 'lucide-react';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock blog post data - in a real app, this would come from an API
  const blogPosts = {
    '1': {
      title: "5 Essential Tips for Planning Your Home Renovation",
      author: "Sarah Thompson",
      publishDate: "January 15, 2025",
      category: "Renovation",
      readTime: "5 min read",
      image: "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg",
      content: `
        <p>Planning a home renovation can be both exciting and overwhelming. Whether you're updating a single room or undertaking a whole-house transformation, proper planning is essential for success. Here are five essential tips to help you navigate the renovation process and achieve the results you've always dreamed of.</p>

        <h2>1. Set a Realistic Budget (and Stick to It)</h2>
        <p>One of the most common mistakes homeowners make is underestimating the true cost of renovation. A good rule of thumb is to budget 20% more than your initial estimate to account for unexpected issues that may arise during construction.</p>
        
        <p>Consider these key budget categories:</p>
        <ul>
          <li>Materials and fixtures</li>
          <li>Labor costs</li>
          <li>Permits and inspections</li>
          <li>Temporary living arrangements (if necessary)</li>
          <li>Contingency fund for unexpected issues</li>
        </ul>

        <h2>2. Research and Hire the Right Contractor</h2>
        <p>Your contractor will be your partner throughout the renovation process, so choosing the right one is crucial. Take time to research potential contractors thoroughly:</p>
        
        <ul>
          <li>Check licenses and insurance</li>
          <li>Read reviews and ask for references</li>
          <li>Get detailed written estimates from multiple contractors</li>
          <li>Visit recent job sites if possible</li>
          <li>Ensure clear communication and professionalism</li>
        </ul>

        <h2>3. Plan for the Unexpected</h2>
        <p>Renovation projects often uncover hidden issues like electrical problems, plumbing issues, or structural concerns. These discoveries can impact both your timeline and budget. The best approach is to expect the unexpected and build flexibility into your plans.</p>

        <h2>4. Consider the Impact on Daily Life</h2>
        <p>Major renovations can disrupt your daily routine significantly. Plan ahead for:</p>
        <ul>
          <li>Alternative cooking arrangements during kitchen renovations</li>
          <li>Temporary bedroom setups during master suite work</li>
          <li>Storage for furniture and belongings</li>
          <li>Parking and access issues</li>
          <li>Noise and dust management</li>
        </ul>

        <h2>5. Focus on Long-Term Value</h2>
        <p>While it's tempting to choose the cheapest options, consider the long-term value and durability of your choices. Invest in quality materials and workmanship in key areas like:</p>
        <ul>
          <li>Structural elements</li>
          <li>HVAC systems</li>
          <li>Plumbing and electrical work</li>
          <li>Windows and insulation</li>
          <li>Roofing materials</li>
        </ul>

        <h2>Conclusion</h2>
        <p>A successful home renovation requires careful planning, realistic expectations, and the right team of professionals. By following these essential tips, you'll be well-prepared to tackle your renovation project with confidence. Remember, good planning upfront can save you time, money, and stress throughout the renovation process.</p>

        <p>If you're considering a home renovation project, our team at BuildCorp is here to help. With over 25 years of experience, we can guide you through every step of the process, from initial planning to final completion. Contact us today for a free consultation.</p>
      `
    },
    // Add more blog posts as needed...
  };

  const post = blogPosts[id as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-orange-500 hover:text-orange-600">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Blog</span>
          </Link>

          <div className="flex items-center space-x-4 mb-4">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">{post.readTime}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{post.publishDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime}</span>
              </div>
            </div>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              lineHeight: '1.8',
              fontSize: '18px'
            }}
          />
        </div>

        {/* Author Bio */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="flex items-start space-x-4">
            <img
              src="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg"
              alt={post.author}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{post.author}</h3>
              <p className="text-gray-600 mb-3">
                Chief Project Manager with over 18 years of experience in construction management. 
                Sarah specializes in residential and commercial renovation projects.
              </p>
              <p className="text-sm text-gray-500">
                Sarah has led over 200 successful renovation projects and is passionate about 
                helping homeowners achieve their dream spaces.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/blog/2" className="group">
              <div className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors">
                <img
                  src="https://images.pexels.com/photos/3862618/pexels-photo-3862618.jpeg"
                  alt="Sustainable Construction"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                    The Future of Sustainable Construction
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Explore the latest trends in sustainable construction and green building practices.
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/blog/3" className="group">
              <div className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors">
                <img
                  src="https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg"
                  alt="Office Design"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                    Modern Office Spaces: Design Trends for 2025
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Discover the latest design trends shaping modern office spaces.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-900 text-white rounded-lg p-8 text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Renovation?</h3>
          <p className="text-gray-300 mb-6">
            Let our experienced team help you plan and execute your dream renovation project.
          </p>
          <Link
            to="/contact"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300"
          >
            Get Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;