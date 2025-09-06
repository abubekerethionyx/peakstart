import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Site {
  id: number;
  name: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface Worker {
  id: number;
  name: string;
  position: string;
  daily_price: number;
  phone: string;
  email: string;
  is_active: boolean;
}

interface DailyActivity {
  id: number;
  activity_name: string;
  description: string;
  date: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  workers_involved: string;
}

interface Cost {
  id: number;
  cost_type: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  worker_name?: string;
  activity_name?: string;
}

const SiteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'workers' | 'activities' | 'costs'>('workers');
  const [site, setSite] = useState<Site | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSiteData();
    }
  }, [id]);

  const fetchSiteData = async () => {
    try {
      setLoading(true);
      const [siteResponse, workersResponse, activitiesResponse, costsResponse] = await Promise.all([
        api.get(`/sites/${id}`),
        api.get(`/workers?site_id=${id}`),
        api.get(`/daily-activities?site_id=${id}`),
        api.get(`/costs?site_id=${id}`)
      ]);

      if (siteResponse.data.success) {
        setSite(siteResponse.data.data);
      }
      if (workersResponse.data.success) {
        setWorkers(workersResponse.data.data);
      }
      if (activitiesResponse.data.success) {
        setActivities(activitiesResponse.data.data);
      }
      if (costsResponse.data.success) {
        setCosts(costsResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching site data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Site not found</h3>
        <button
          onClick={() => navigate('/admin/sites')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Sites
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/sites')}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{site.name}</h2>
            <p className="text-gray-600">{site.location}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(site.status)}`}>
          {site.status}
        </span>
      </div>

      {/* Site Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-gray-900">{site.description || 'No description provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Project Duration</label>
            <p className="text-gray-900">
              {site.start_date ? new Date(site.start_date).toLocaleDateString() : 'Not set'} - 
              {site.end_date ? new Date(site.end_date).toLocaleDateString() : 'Ongoing'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Workers</p>
              <p className="text-2xl font-semibold text-gray-900">{workers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Daily Activities</p>
              <p className="text-2xl font-semibold text-gray-900">{activities.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Costs</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${costs.reduce((sum, cost) => sum + cost.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'workers', label: 'Workers', count: workers.length },
              { id: 'activities', label: 'Daily Activities', count: activities.length },
              { id: 'costs', label: 'Costs', count: costs.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Workers Tab */}
          {activeTab === 'workers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Workers</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/admin/sites/${id}/workers`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Manage Workers
                  </button>
              
                </div>
              </div>
              
              {workers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No workers assigned to this site yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workers.map((worker) => (
                    <div key={worker.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{worker.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          worker.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {worker.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{worker.position}</p>
                      <p className="text-sm font-medium text-green-600">${worker.daily_price}/day</p>
                      {worker.phone && <p className="text-xs text-gray-500 mt-1">{worker.phone}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Daily Activities</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/admin/sites/${id}/activities`)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Manage Activities
                  </button>
              
                </div>
              </div>
              
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No daily activities recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{activity.activity_name}</h4>
                        <span className="text-sm font-medium text-green-600">
                          ${activity.total_price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                        <span>Qty: {activity.quantity} × ${activity.unit_price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Costs Tab */}
          {activeTab === 'costs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Costs</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/admin/sites/${id}/costs`)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Manage Costs
                  </button>               
                </div>
              </div>
              
              {costs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No costs recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {costs.map((cost) => (
                    <div key={cost.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{cost.description}</h4>
                          <p className="text-sm text-gray-600 capitalize">{cost.cost_type}</p>
                        </div>
                        <span className="text-lg font-bold text-red-600">
                          ${cost.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{new Date(cost.date).toLocaleDateString()}</span>
                        {cost.category && <span className="capitalize">{cost.category}</span>}
                      </div>
                      {(cost.worker_name || cost.activity_name) && (
                        <p className="text-xs text-gray-500 mt-1">
                          Related to: {cost.worker_name || cost.activity_name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteDetailPage;
