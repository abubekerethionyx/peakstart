import React from 'react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard Overview</h2>
      <p className="text-lg text-gray-700 mb-4">
        Welcome to the Peakstart General Construction Admin Panel. Use the sidebar to manage different sections of your website.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Example Dashboard Cards */}
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-blue-800">Total Projects</h3>
          <p className="text-3xl font-bold text-blue-900">150+</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-green-800">New Contact Submissions</h3>
          <p className="text-3xl font-bold text-green-900">5</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-yellow-800">Active Blog Posts</h3>
          <p className="text-3xl font-bold text-yellow-900">25</p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Go to <a href="/admin/services" className="text-blue-600 hover:underline">Manage Services</a></li>
          <li>Go to <a href="/admin/projects" className="text-blue-600 hover:underline">Manage Projects</a></li>
          <li>Go to <a href="/admin/contactsubmissions" className="text-blue-600 hover:underline">View Contact Submissions</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
