import React, { useState, useEffect } from 'react';
import { createCompanyStat, getHomeStats, updateCompanyStat, deleteCompanyStat } from '../../services/api';

interface CompanyStat {
  id: number;
  number: string;
  label: string;
  icon_name: string;
}

const CompanyStatForm: React.FC = () => {
  const [formData, setFormData] = useState({
    number: '',
    label: '',
    icon_name: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [companyStats, setCompanyStats] = useState<CompanyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCompanyStatId, setEditingCompanyStatId] = useState<number | null>(null);

  const fetchCompanyStats = async () => {
    setLoading(true);
    setError(null);
    const response = await getHomeStats(); // Assuming getHomeStats also fetches all for admin
    if (response.success && response.data) {
      setCompanyStats(response.data);
    } else {
      setError(response.error || "Failed to fetch company stats.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanyStats();
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
      const response = await createCompanyStat(formData);
      if (response.success) {
        setMessage(response.message || 'Company stat created successfully!');
        setFormData({
          number: '',
          label: '',
          icon_name: '',
        });
        fetchCompanyStats(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to create company stat.');
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

    if (editingCompanyStatId === null) {
      setIsError(true);
      setMessage('No company stat selected for update.');
      return;
    }

    try {
      const response = await updateCompanyStat(editingCompanyStatId, formData);
      if (response.success) {
        setMessage(response.message || 'Company stat updated successfully!');
        setFormData({
          number: '',
          label: '',
          icon_name: '',
        });
        setEditingCompanyStatId(null); // Exit edit mode
        fetchCompanyStats(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to update company stat.');
      }
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const handleEdit = (companyStat: CompanyStat) => {
    setEditingCompanyStatId(companyStat.id);
    setFormData({
      number: companyStat.number,
      label: companyStat.label,
      icon_name: companyStat.icon_name,
    });
    setMessage(null);
    setIsError(false);
  };

  const handleDelete = async (companyStatId: number) => {
    if (window.confirm('Are you sure you want to delete this company stat?')) {
      try {
        const response = await deleteCompanyStat(companyStatId);
        if (response.success) {
          setMessage(response.message || 'Company stat deleted successfully!');
          fetchCompanyStats(); // Refresh the list
        } else {
          setIsError(true);
          setMessage(response.error || 'Failed to delete company stat.');
        }
      } catch (err: any) {
        setIsError(true);
        setMessage(err.message || 'An unexpected error occurred.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCompanyStatId(null);
    setFormData({
      number: '',
      label: '',
      icon_name: '',
    });
    setMessage(null);
    setIsError(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {editingCompanyStatId ? 'Edit Company Statistic' : 'Add New Company Statistic'}
      </h2>
      {message && (
        <div className={`p-4 rounded-md mb-6 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-center font-medium`}>
          {message}
        </div>
      )}
      <form onSubmit={editingCompanyStatId ? handleUpdateSubmit : handleAddSubmit} className="space-y-6">
        <div>
          <label htmlFor="number" className="block text-sm font-semibold text-gray-700 mb-1">Number (e.g., 500+)</label>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="label" className="block text-sm font-semibold text-gray-700 mb-1">Label (e.g., Projects Completed)</label>
          <input
            type="text"
            id="label"
            name="label"
            value={formData.label}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="icon_name" className="block text-sm font-semibold text-gray-700 mb-1">Icon Name (e.g., CheckCircle, Clock)</label>
          <input
            type="text"
            id="icon_name"
            name="icon_name"
            value={formData.icon_name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingCompanyStatId ? 'Update Stat' : 'Add Stat'}
          </button>
          {editingCompanyStatId && (
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
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Existing Company Statistics</h3>
        {loading ? (
          <p className="text-center text-gray-600">Loading company stats...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : companyStats.length === 0 ? (
          <p className="text-center text-gray-600">No company stats added yet.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companyStats.map((stat) => (
                  <tr key={stat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.label}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.icon_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(stat)} className="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(stat.id)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
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

export default CompanyStatForm;
