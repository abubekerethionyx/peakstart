import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard Overview</h2>
      <p className="text-lg text-gray-700 mb-8">
        Welcome to the Peakstart General Construction Admin Panel. Choose your management area below.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Website Administration Card */}
        <div 
          className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300 text-white"
          onClick={() => navigate('/admin/website')}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-center">Website Administration</h3>
          <p className="text-blue-100 text-center mb-6">
            Manage your website content including services, projects, blog posts, team members, testimonials, and more.
          </p>
          <div className="text-center">
            <span className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">
              Manage Content →
            </span>
          </div>
        </div>

        {/* Site Management Card */}
        <div 
          className="bg-gradient-to-br from-green-500 to-green-700 p-8 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300 text-white"
          onClick={() => navigate('/admin/sites')}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                <path d="M6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zM6 11a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-center">Site Management</h3>
          <p className="text-green-100 text-center mb-6">
            Manage construction sites, workers, attendance, daily activities, and cost tracking for your projects.
          </p>
          <div className="text-center">
            <span className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">
              Manage Sites →
            </span>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-700">Active Sites</h4>
            <p className="text-2xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-700">Total Workers</h4>
            <p className="text-2xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-700">This Month's Costs</h4>
            <p className="text-2xl font-bold text-red-600">$0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
