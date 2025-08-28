import React, { useState, useEffect } from 'react';
import { createAward, getAwards, updateAward, deleteAward } from '../../services/api';

interface Award {
  id: number;
  name: string;
  year: string;
}

const AwardForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    year: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAwardId, setEditingAwardId] = useState<number | null>(null);

  const fetchAwards = async () => {
    setLoading(true);
    setError(null);
    const response = await getAwards();
    if (response.success && response.data) {
      setAwards(response.data);
    } else {
      setError(response.error || "Failed to fetch awards.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await createAward(formData);
      if (response.success) {
        setMessage(response.message || 'Award created successfully!');
        setFormData({
          name: '',
          year: '',
        });
        fetchAwards(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to create award.');
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

    if (editingAwardId === null) {
      setIsError(true);
      setMessage('No award selected for update.');
      return;
    }

    try {
      const response = await updateAward(editingAwardId, formData);
      if (response.success) {
        setMessage(response.message || 'Award updated successfully!');
        setFormData({
          name: '',
          year: '',
        });
        setEditingAwardId(null); // Exit edit mode
        fetchAwards(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to update award.');
      }
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const handleEdit = (award: Award) => {
    setEditingAwardId(award.id);
    setFormData({
      name: award.name,
      year: award.year,
    });
    setMessage(null);
    setIsError(false);
  };

  const handleDelete = async (awardId: number) => {
    if (window.confirm('Are you sure you want to delete this award?')) {
      try {
        const response = await deleteAward(awardId);
        if (response.success) {
          setMessage(response.message || 'Award deleted successfully!');
          fetchAwards(); // Refresh the list
        } else {
          setIsError(true);
          setMessage(response.error || 'Failed to delete award.');
        }
      } catch (err: any) {
        setIsError(true);
        setMessage(err.message || 'An unexpected error occurred.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingAwardId(null);
    setFormData({
      name: '',
      year: '',
    });
    setMessage(null);
    setIsError(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {editingAwardId ? 'Edit Award' : 'Add New Award'}
      </h2>
      {message && (
        <div className={`p-4 rounded-md mb-6 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-center font-medium`}>
          {message}
        </div>
      )}
      <form onSubmit={editingAwardId ? handleUpdateSubmit : handleAddSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Award Name</label>
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
          <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
          <input
            type="text"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 2024"
            required
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingAwardId ? 'Update Award' : 'Add Award'}
          </button>
          {editingAwardId && (
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
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Existing Awards</h3>
        {loading ? (
          <p className="text-center text-gray-600">Loading awards...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : awards.length === 0 ? (
          <p className="text-center text-gray-600">No awards added yet.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {awards.map((award) => (
                  <tr key={award.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{award.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{award.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(award)} className="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(award.id)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
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

export default AwardForm;
