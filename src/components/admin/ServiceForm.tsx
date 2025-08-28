import React, { useState, useEffect } from 'react';
import { createService, getAllServices, updateService, deleteService } from '../../services/api';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon_name: string;
  features: string[];
}

const ServiceForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    icon_name: '',
    features: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    const response = await getAllServices();
    if (response.success && response.data) {
      setServices(response.data);
    } else {
      setError(response.error || "Failed to fetch services.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const serviceData = {
      title: formData.title,
      description: formData.description,
      image: formData.image,
      icon_name: formData.icon_name,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ''),
    };

    try {
      const response = await createService(serviceData);
      if (response.success) {
        setMessage(response.message || 'Service created successfully!');
        setFormData({
          title: '',
          description: '',
          image: '',
          icon_name: '',
          features: '',
        });
        fetchServices(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to create service.');
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

    if (editingServiceId === null) {
      setIsError(true);
      setMessage('No service selected for update.');
      return;
    }

    const serviceData = {
      title: formData.title,
      description: formData.description,
      image: formData.image,
      icon_name: formData.icon_name,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ''),
    };

    try {
      const response = await updateService(editingServiceId, serviceData);
      if (response.success) {
        setMessage(response.message || 'Service updated successfully!');
        setFormData({
          title: '',
          description: '',
          image: '',
          icon_name: '',
          features: '',
        });
        setEditingServiceId(null); // Exit edit mode
        fetchServices(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to update service.');
      }
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingServiceId(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      image: service.image,
      icon_name: service.icon_name || '',
      features: service.features ? service.features.join(', ') : '',
    });
    setMessage(null);
    setIsError(false);
  };

  const handleDelete = async (serviceId: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await deleteService(serviceId);
        if (response.success) {
          setMessage(response.message || 'Service deleted successfully!');
          fetchServices(); // Refresh the list
        } else {
          setIsError(true);
          setMessage(response.error || 'Failed to delete service.');
        }
      } catch (err: any) {
        setIsError(true);
        setMessage(err.message || 'An unexpected error occurred.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      icon_name: '',
      features: '',
    });
    setMessage(null);
    setIsError(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {editingServiceId ? 'Edit Service' : 'Add New Service'}
      </h2>
      {message && (
        <div className={`p-4 rounded-md mb-6 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-center font-medium`}>
          {message}
        </div>
      )}
      <form onSubmit={editingServiceId ? handleUpdateSubmit : handleAddSubmit} className="space-y-6">
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
          <label htmlFor="icon_name" className="block text-sm font-semibold text-gray-700 mb-1">Icon Name (e.g., Building, Wrench)</label>
          <input
            type="text"
            id="icon_name"
            name="icon_name"
            value={formData.icon_name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="features" className="block text-sm font-semibold text-gray-700 mb-1">Features (comma-separated)</label>
          <textarea
            id="features"
            name="features"
            value={formData.features}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Feature 1, Feature 2, Feature 3"
          ></textarea>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingServiceId ? 'Update Service' : 'Add Service'}
          </button>
          {editingServiceId && (
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
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Existing Services</h3>
        {loading ? (
          <p className="text-center text-gray-600">Loading services...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-600">No services added yet.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{service.description.substring(0, 70)}{service.description.length > 70 ? '...' : ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={service.image} alt={service.title} className="h-12 w-12 object-cover rounded-md" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.icon_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{service.features.join(', ').substring(0, 50)}{service.features.join(', ').length > 50 ? '...' : ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
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

export default ServiceForm;
