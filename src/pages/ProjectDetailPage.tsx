import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { getProjectById } from '../services/api';

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

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProjectById(Number(id));
        if (response.success) {
          setProject(response.data || null);
        } else {
          setError(response.error || 'Failed to fetch project details');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading project details...</p>
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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/portfolio"
            className="inline-flex items-center text-lg mb-6 hover:text-orange-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Portfolio
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-gray-300">{project.description}</p>
          <div className="mt-6 flex items-center space-x-6 text-gray-200">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
            <span>{project.location}</span>
          </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{project.completionDate}</span>
        </div>
      </div>
              </div>
            </section>

      {/* Project Details Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-lg shadow-lg -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto rounded-lg shadow-md mb-8"
            />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Overview</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {project.description}
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="text-gray-700 leading-relaxed">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
            </p>
          </div>

                  <div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Project Information</h3>
              <ul className="space-y-3 text-gray-700">
                <li><strong>Category:</strong> {project.category}</li>
                <li><strong>Client:</strong> {project.client}</li>
                <li><strong>Location:</strong> {project.location}</li>
                <li><strong>Completion Date:</strong> {project.completionDate}</li>
              </ul>
                </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us for Similar Projects</h3>
              <p className="text-gray-700 mb-4">
                Interested in a project like this? Reach out to discuss your needs.
              </p>
                <Link
                  to="/contact"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full text-center block"
                >
                  Get a Free Quote
                </Link>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
};

export default ProjectDetailPage;