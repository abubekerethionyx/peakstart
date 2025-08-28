import React, { useState, useEffect } from 'react';
import { createProject, getAllProjects, updateProject, deleteProject } from '../../services/api';

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

const ProjectForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    completionDate: '',
    image: '',
    description: '',
    client: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    const response = await getAllProjects();
    if (response.success && response.data) {
      setProjects(response.data);
    } else {
      setError(response.error || "Failed to fetch projects.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
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
      const response = await createProject(formData);
      if (response.success) {
        setMessage(response.message || 'Project created successfully!');
        setFormData({
          title: '',
          category: '',
          location: '',
          completionDate: '',
          image: '',
          description: '',
          client: '',
        });
        fetchProjects(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to create project.');
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

    if (editingProjectId === null) {
      setIsError(true);
      setMessage('No project selected for update.');
      return;
    }

    try {
      const response = await updateProject(editingProjectId, formData);
      if (response.success) {
        setMessage(response.message || 'Project updated successfully!');
        setFormData({
          title: '',
          category: '',
          location: '',
          completionDate: '',
          image: '',
          description: '',
          client: '',
        });
        setEditingProjectId(null); // Exit edit mode
        fetchProjects(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to update project.');
      }
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setFormData({
      title: project.title,
      category: project.category,
      location: project.location,
      completionDate: project.completionDate,
      image: project.image,
      description: project.description,
      client: project.client,
    });
    setMessage(null);
    setIsError(false);
  };

  const handleDelete = async (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await deleteProject(projectId);
        if (response.success) {
          setMessage(response.message || 'Project deleted successfully!');
          fetchProjects(); // Refresh the list
        } else {
          setIsError(true);
          setMessage(response.error || 'Failed to delete project.');
        }
      } catch (err: any) {
        setIsError(true);
        setMessage(err.message || 'An unexpected error occurred.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setFormData({
      title: '',
      category: '',
      location: '',
      completionDate: '',
      image: '',
      description: '',
      client: '',
    });
    setMessage(null);
    setIsError(false);
  };

  const categories = [
    'Commercial',
    'Residential',
    'Industrial',
    'Infrastructure',
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {editingProjectId ? 'Edit Project' : 'Add New Project'}
      </h2>
      {message && (
        <div className={`p-4 rounded-md mb-6 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-center font-medium`}>
          {message}
        </div>
      )}
      <form onSubmit={editingProjectId ? handleUpdateSubmit : handleAddSubmit} className="space-y-6">
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
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="completionDate" className="block text-sm font-semibold text-gray-700 mb-1">Completion Date</label>
          <input
            type="text"
            id="completionDate"
            name="completionDate"
            value={formData.completionDate}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., December 2024"
            required
          />
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
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="client" className="block text-sm font-semibold text-gray-700 mb-1">Client</label>
          <input
            type="text"
            id="client"
            name="client"
            value={formData.client}
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
            {editingProjectId ? 'Update Project' : 'Add Project'}
          </button>
          {editingProjectId && (
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
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Existing Projects</h3>
        {loading ? (
          <p className="text-center text-gray-600">Loading projects...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-600">No projects added yet.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.completionDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={project.image} alt={project.title} className="h-12 w-12 object-cover rounded-md" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(project)} className="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
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

export default ProjectForm;
