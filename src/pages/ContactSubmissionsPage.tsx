import React, { useState, useEffect } from 'react';
import { getContactSubmissions, deleteContactSubmission } from '../services/api';

interface ContactSubmission {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  projectType?: string;
  message: string;
  budget?: string;
  submissionDate: string; // Assuming the backend provides this
}

const ContactSubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    const response = await getContactSubmissions();
    if (response.success && response.data) {
      setSubmissions(response.data);
    } else {
      setError(response.error || "Failed to fetch contact submissions.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleDelete = async (submissionId: number) => {
    if (window.confirm('Are you sure you want to delete this contact submission?')) {
      try {
        const response = await deleteContactSubmission(submissionId);
        if (response.success) {
          setMessage(response.message || 'Contact submission deleted successfully!');
          fetchSubmissions(); // Refresh the list
        } else {
          setIsError(true);
          setMessage(response.error || 'Failed to delete contact submission.');
        }
      } catch (err: any) {
        setIsError(true);
        setMessage(err.message || 'An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Submissions</h2>
      {message && (
        <div className={`p-3 rounded-md mb-4 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}
      {loading ? (
        <p>Loading submissions...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : submissions.length === 0 ? (
        <p>No contact submissions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(submission.submissionDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.firstName} {submission.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.phone || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.projectType || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{submission.message.substring(0, 50)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.budget || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(submission.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissionsPage;
