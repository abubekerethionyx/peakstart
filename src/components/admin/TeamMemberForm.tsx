import React, { useState, useEffect } from 'react';
import { createTeamMember, getTeamMembers, updateTeamMember, deleteTeamMember } from '../../services/api';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  experience: string;
  image: string;
  bio: string;
}

const TeamMemberForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    experience: '',
    image: '',
    bio: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTeamMemberId, setEditingTeamMemberId] = useState<number | null>(null);

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);
    const response = await getTeamMembers();
    if (response.success && response.data) {
      setTeamMembers(response.data);
    } else {
      setError(response.error || "Failed to fetch team members.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeamMembers();
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
      const response = await createTeamMember(formData);
      if (response.success) {
        setMessage(response.message || 'Team member created successfully!');
        setFormData({
          name: '',
          position: '',
          experience: '',
          image: '',
          bio: '',
        });
        fetchTeamMembers(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to create team member.');
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

    if (editingTeamMemberId === null) {
      setIsError(true);
      setMessage('No team member selected for update.');
      return;
    }

    try {
      const response = await updateTeamMember(editingTeamMemberId, formData);
      if (response.success) {
        setMessage(response.message || 'Team member updated successfully!');
        setFormData({
          name: '',
          position: '',
          experience: '',
          image: '',
          bio: '',
        });
        setEditingTeamMemberId(null); // Exit edit mode
        fetchTeamMembers(); // Refresh the list
      } else {
        setIsError(true);
        setMessage(response.error || 'Failed to update team member.');
      }
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const handleEdit = (teamMember: TeamMember) => {
    setEditingTeamMemberId(teamMember.id);
    setFormData({
      name: teamMember.name,
      position: teamMember.position,
      experience: teamMember.experience,
      image: teamMember.image,
      bio: teamMember.bio,
    });
    setMessage(null);
    setIsError(false);
  };

  const handleDelete = async (teamMemberId: number) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        const response = await deleteTeamMember(teamMemberId);
        if (response.success) {
          setMessage(response.message || 'Team member deleted successfully!');
          fetchTeamMembers(); // Refresh the list
        } else {
          setIsError(true);
          setMessage(response.error || 'Failed to delete team member.');
        }
      } catch (err: any) {
        setIsError(true);
        setMessage(err.message || 'An unexpected error occurred.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingTeamMemberId(null);
    setFormData({
      name: '',
      position: '',
      experience: '',
      image: '',
      bio: '',
    });
    setMessage(null);
    setIsError(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {editingTeamMemberId ? 'Edit Team Member' : 'Add New Team Member'}
      </h2>
      {message && (
        <div className={`p-4 rounded-md mb-6 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-center font-medium`}>
          {message}
        </div>
      )}
      <form onSubmit={editingTeamMemberId ? handleUpdateSubmit : handleAddSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
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
          <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-1">Position</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-1">Experience</label>
          <input
            type="text"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 10+ years"
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
          <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          ></textarea>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingTeamMemberId ? 'Update Team Member' : 'Add Team Member'}
          </button>
          {editingTeamMemberId && (
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
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Existing Team Members</h3>
        {loading ? (
          <p className="text-center text-gray-600">Loading team members...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : teamMembers.length === 0 ? (
          <p className="text-center text-gray-600">No team members added yet.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.experience}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={member.image} alt={member.name} className="h-12 w-12 object-cover rounded-md" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
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

export default TeamMemberForm;
