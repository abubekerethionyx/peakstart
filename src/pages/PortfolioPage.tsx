import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Eye } from 'lucide-react';
import { getAllProjects } from '../services/api';

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  completionDate: string;
  image: string;
  description: string;
  client: string;
}

const PortfolioPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllProjects(selectedCategory);
        if (response.success) {
          setProjects(response.data || []);
        } else {
          setError(response.error || 'Failed to fetch projects');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedCategory]);

  const categories = [
    'All',
    'Commercial',
    'Residential',
    'Industrial',
    'Infrastructure',
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading projects...</p>
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
    <div className="min-h-screen bg-gray-50 pt-8 pb-12">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Portfolio</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our diverse range of successful construction projects, showcasing our expertise and commitment to excellence.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-300
                ${selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden group transition-transform duration-300 hover:scale-[1.02]">
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    to={`/portfolio/${project.id}`}
                      className="text-white text-lg font-semibold border-2 border-white px-5 py-2 rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300"
                  >
                      <Eye className="w-6 h-6 inline-block mr-2" />View Project
                  </Link>
                </div>
              </div>
              <div className="p-6">
                  <div className="text-sm text-orange-600 font-semibold mb-2">
                    {project.category}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                <Link
                  to={`/portfolio/${project.id}`}
                      className="hover:text-orange-600 transition-colors duration-200"
                >
                      {project.title}
                </Link>
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{project.completionDate}</span>
              </div>
            </div>
        </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-700">No projects found for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;