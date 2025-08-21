import React, { useState, useEffect } from 'react';
import { createCertification, getCertifications, updateCertification, deleteCertification } from '../../services/api';

interface Certification {
  id: number;
  name: string;
}

const CertificationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCertificationId, setEditingCertificationId] = useState<number | null>(null);

  const fetchCertifications = async () => {
    setLoading(true);
    setError(null);
    const response = await getCertifications();
    if (response.success && response.data) {
      setCertifications(response.data);
    } else {
      setError(response.error || "Failed to fetch certifications.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCertifications();
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
      const response = await createCertification(formData);
      if (response.success) {
        setMessage(response.message || 'Certification created successfully!');
        setFormData({
          name: '',
        });
        fetchCertifications(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to create certification.');
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

    if (editingCertificationId === null) {
      setIsError(true);
      setMessage('No certification selected for update.');
      return;
    }

    try {
      const response = await updateCertification(editingCertificationId, formData);
      if (response.success) {
        setMessage(response.message || 'Certification updated successfully!');
        setFormData({
          name: '',
        });
        setEditingCertificationId(null); // Exit edit mode
        fetchCertifications(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to update certification.');
      }
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const handleEdit = (certification: Certification) => {
    setEditingCertificationId(certification.id);
    setFormData({
      name: certification.name,
    });
    setMessage(null);
    setIsError(false);
  };

  const handleDelete = async (certificationId: number) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        const response = await deleteCertification(certificationId);
        if (response.success) {
          setMessage(response.message || 'Certification deleted successfully!');
          fetchCertifications(); // Refresh the list
        } else {
          setIsError(true);
          setMessage(response.error || 'Failed to delete certification.');
        }
      } catch (err: any) {
        setIsError(true);
        setMessage(err.message || 'An unexpected error occurred.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCertificationId(null);
    setFormData({
      name: '',
    });
    setMessage(null);
    setIsError(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {editingCertificationId ? 'Edit Certification' : 'Add New Certification'}
      </h2>
      {message && (
        <div className={`p-4 rounded-md mb-6 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-center font-medium`}>
          {message}
        </div>
      )}
      <form onSubmit={editingCertificationId ? handleUpdateSubmit : handleAddSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Certification Name</label>
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
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingCertificationId ? 'Update Certification' : 'Add Certification'}
          </button>
          {editingCertificationId && (
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
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Existing Certifications</h3>
        {loading ? (
          <p className="text-center text-gray-600">Loading certifications...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : certifications.length === 0 ? (
          <p className="text-center text-gray-600">No certifications added yet.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {certifications.map((certification) => (
                  <tr key={certification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{certification.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(certification)} className="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(certification.id)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
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

export default CertificationForm;
