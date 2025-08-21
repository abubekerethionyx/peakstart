import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Eye } from 'lucide-react';

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

  const projects: Project[] = [
    {
      id: 1,
      title: "Modern Office Complex",
      category: "Commercial",
      location: "Downtown District",
      completionDate: "December 2024",
      image: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg",
      description: "State-of-the-art 15-story office building with sustainable features and modern amenities.",
      client: "Metro Corp"
    },
    {
      id: 2,
      title: "Luxury Residential Villa",
      category: "Residential",
      location: "Hillside Heights",
      completionDate: "October 2024",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      description: "Custom-designed luxury villa with panoramic views and premium finishes.",
      client: "Private Client"
    },
    {
      id: 3,
      title: "Manufacturing Facility",
      category: "Industrial",
      location: "Industrial Park",
      completionDate: "August 2024",
      image: "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg",
      description: "Large-scale manufacturing facility with advanced infrastructure and safety systems.",
      client: "TechManufacturing Inc"
    },
    {
      id: 4,
      title: "Shopping Center Renovation",
      category: "Commercial",
      location: "City Center",
      completionDate: "June 2024",
      image: "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
      description: "Complete renovation of existing shopping center with modern retail spaces and improved accessibility.",
      client: "Retail Properties LLC"
    },
    {
      id: 5,
      title: "Suburban Housing Development",
      category: "Residential",
      location: "Green Valley",
      completionDate: "April 2024",
      image: "https://images.pexels.com/photos/323772/pexels-photo-323772.jpeg",
      description: "50-unit housing development with energy-efficient homes and community amenities.",
      client: "Valley Developers"
    },
    {
      id: 6,
      title: "Bridge Construction",
      category: "Infrastructure",
      location: "River Crossing",
      completionDate: "February 2024",
      image: "https://images.pexels.com/photos/3862618/pexels-photo-3862618.jpeg",
      description: "New bridge construction connecting two major districts with modern engineering solutions.",
      client: "City Transportation Dept"
    },
    {
      id: 7,
      title: "Hospital Extension",
      category: "Commercial",
      location: "Medical District",
      completionDate: "January 2024",
      image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg",
      description: "Modern hospital wing with advanced medical facilities and patient-centered design.",
      client: "Central Medical Center"
    },
    {
      id: 8,
      title: "Warehouse Complex",
      category: "Industrial",
      location: "Logistics Hub",
      completionDate: "November 2023",
      image: "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg",
      description: "Multi-building warehouse complex with automated systems and loading facilities.",
      client: "LogiCorp Solutions"
    },
    {
      id: 9,
      title: "Apartment Building",
      category: "Residential",
      location: "Urban District",
      completionDate: "September 2023",
      image: "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg",
      description: "Modern 8-story apartment building with luxury amenities and sustainable features.",
      client: "Urban Living Partners"
    }
  ];

  const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'Infrastructure'];

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our extensive portfolio of completed projects showcasing our expertise 
            across residential, commercial, industrial, and infrastructure construction.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    to={`/portfolio/${project.id}`}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Details</span>
                  </Link>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Completed {project.completionDate}</span>
                  </div>
                </div>

                <Link
                  to={`/portfolio/${project.id}`}
                  className="inline-block w-full text-center bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
                >
                  View Project Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No projects found in the {selectedCategory.toLowerCase()} category.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-blue-900 text-white rounded-lg p-8 text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-6 text-gray-300">
            Let us bring your vision to life with our expertise and commitment to excellence.
          </p>
          <Link
            to="/contact"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300"
          >
            Get Your Free Quote
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;