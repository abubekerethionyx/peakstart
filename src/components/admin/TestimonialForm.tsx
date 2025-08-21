import React, { useState, useEffect } from 'react';
import { createTestimonial, getHomeTestimonials, updateTestimonial, deleteTestimonial } from '../../services/api';

interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  image: string;
}

const TestimonialForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    text: '',
    image: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    const response = await getHomeTestimonials(); // Assuming getHomeTestimonials also fetches all for admin
    if (response.success && response.data) {
      setTestimonials(response.data);
    } else {
      setError(response.error || "Failed to fetch testimonials.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
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

    try {
      const response = await createTestimonial(formData);
      if (response.success) {
        setMessage(response.message || 'Testimonial created successfully!');
        setFormData({
          name: '',
          company: '',
          text: '',
          image: '',
        });
        fetchTestimonials(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to create testimonial.');
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

    if (editingTestimonialId === null) {
      setIsError(true);
      setMessage('No testimonial selected for update.');
      return;
    }

    try {
      const response = await updateTestimonial(editingTestimonialId, formData);
      if (response.success) {
        setMessage(response.message || 'Testimonial updated successfully!');
        setFormData({
          name: '',
          company: '',
          text: '',
          image: '',
        });
        setEditingTestimonialId(null); // Exit edit mode
        fetchTestimonials(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to update testimonial.');
      }
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonialId(testimonial.id);
    setFormData({
      name: testimonial.name,
      company: testimonial.company,
      text: testimonial.text,
      image: testimonial.image,
    });
    setMessage(null);
    setIsError(false);
  };

  const handleDelete = async (testimonialId: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const response = await deleteTestimonial(testimonialId);
        if (response.success) {
          setMessage(response.message || 'Testimonial deleted successfully!');
          fetchTestimonials(); // Refresh the list
        } else {
          setIsError(true);
          setMessage(response.error || 'Failed to delete testimonial.');
        }
      } catch (err: any) {
        setIsError(true);
        setMessage(err.message || 'An unexpected error occurred.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingTestimonialId(null);
    setFormData({
      name: '',
      company: '',
      text: '',
      image: '',
    });
    setMessage(null);
    setIsError(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {editingTestimonialId ? 'Edit Testimonial' : 'Add New Testimonial'}
      </h2>
      {message && (
        <div className={`p-4 rounded-md mb-6 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-center font-medium`}>
          {message}
        </div>
      )}
      <form onSubmit={editingTestimonialId ? handleUpdateSubmit : handleAddSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Client Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="text" className="block text-sm font-semibold text-gray-700 mb-1">Testimonial Text</label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
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
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingTestimonialId ? 'Update Testimonial' : 'Add Testimonial'}
          </button>
          {editingTestimonialId && (
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
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Existing Testimonials</h3>
        {loading ? (
          <p className="text-center text-gray-600">Loading testimonials...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-600">No testimonials added yet.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Text</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{testimonial.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testimonial.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{testimonial.text.substring(0, 70)}{testimonial.text.length > 70 ? '...' : ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 object-cover rounded-md" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(testimonial)} className="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(testimonial.id)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
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

export default TestimonialForm;
