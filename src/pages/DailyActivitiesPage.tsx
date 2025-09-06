import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkers, getDailyActivities, createDailyActivity, updateDailyActivity, deleteDailyActivity, createCost } from '../services/api';

interface DailyActivity {
  id: number;
  site_id: number;
  site_name: string;
  date: string;
  activity_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  workers_involved: string;
}

const DailyActivitiesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<DailyActivity | null>(null);
  const [activityForm, setActivityForm] = useState({
    date: new Date().toISOString().split('T')[0],
    activity_name: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    total_price: 0,
    workers_involved: [] as number[]
  });

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, dateFilter, customStartDate, customEndDate, selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch workers for this site
      const workersResponse = await getWorkers(parseInt(id!));
      if (workersResponse.success) {
        setWorkers(workersResponse.data || []);
      }

      // Fetch activities for this site with date filters
      let startDate: string | undefined;
      let endDate: string | undefined;
      let date: string | undefined;
      
      // Apply date filters
      if (dateFilter === 'today') {
        date = selectedDate;
      } else if (dateFilter === 'week') {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        startDate = weekStart.toISOString().split('T')[0];
      } else if (dateFilter === 'month') {
        const monthStart = new Date();
        monthStart.setMonth(monthStart.getMonth() - 1);
        startDate = monthStart.toISOString().split('T')[0];
      } else if (dateFilter === 'custom' && customStartDate && customEndDate) {
        startDate = customStartDate;
        endDate = customEndDate;
      }

      const activitiesResponse = await getDailyActivities(parseInt(id!), startDate, endDate, date);
      if (activitiesResponse.success) {
        setActivities(activitiesResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        ...activityForm,
        site_id: parseInt(id!),
        total_price: activityForm.quantity * activityForm.unit_price,
        workers_involved: activityForm.workers_involved
      };

      if (editingActivity) {
        await updateDailyActivity(editingActivity.id, formData);
      } else {
        await createDailyActivity(formData);
      }
      
      setShowAddActivity(false);
      setEditingActivity(null);
      setActivityForm({
        date: new Date().toISOString().split('T')[0],
        activity_name: '',
        description: '',
        quantity: 1,
        unit_price: 0,
        total_price: 0,
        workers_involved: []
      });
      fetchData();
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleEditActivity = (activity: DailyActivity) => {
    setEditingActivity(activity);
    setActivityForm({
      date: activity.date,
      activity_name: activity.activity_name,
      description: activity.description || '',
      quantity: activity.quantity,
      unit_price: activity.unit_price,
      total_price: activity.total_price,
      workers_involved: activity.workers_involved ? JSON.parse(activity.workers_involved) : []
    });
    setShowAddActivity(true);
  };

  const handleDeleteActivity = async (activityId: number) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteDailyActivity(activityId);
        fetchData();
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    }
  };

  const handleApproveActivity = async (activity: DailyActivity) => {
    if (window.confirm(`Approve activity "${activity.activity_name}" for $${activity.total_price}?`)) {
      try {
        // Create cost record for approved activity
        await createCost({
          site_id: parseInt(id!),
          daily_activity_id: activity.id,
          cost_type: 'activity',
          description: `Approved activity: ${activity.activity_name}`,
          amount: activity.total_price,
          date: activity.date,
          category: 'labor'
        });
        
        alert('Activity approved and cost created successfully!');
        fetchData();
      } catch (error) {
        console.error('Error approving activity:', error);
      }
    }
  };

  const getDateRangeText = () => {
    switch (dateFilter) {
      case 'today': return `Today (${selectedDate})`;
      case 'week': return 'Last 7 days';
      case 'month': return 'Last 30 days';
      case 'custom': return `${customStartDate} to ${customEndDate}`;
      default: return 'All time';
    }
  };

  const totalActivitiesCost = activities.reduce((sum, activity) => sum + activity.total_price, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/admin/sites/${id}`)}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Daily Activities</h2>
            <p className="text-gray-600">Track and manage daily construction activities</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddActivity(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Activity
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Filter Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateFilter === 'today' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {dateFilter === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-green-50 rounded-md">
          <p className="text-sm text-green-800">
            <strong>Showing data for:</strong> {getDateRangeText()}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Activities</p>
              <p className="text-2xl font-semibold text-gray-900">{activities.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Quantity</p>
              <p className="text-2xl font-semibold text-gray-900">
                {activities.reduce((sum, activity) => sum + activity.quantity, 0)}
              </p>
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
              <p className="text-sm font-medium text-gray-500">Total Cost</p>
              <p className="text-2xl font-semibold text-gray-900">${totalActivitiesCost.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Activities List</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <div key={activity.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">{activity.activity_name}</h4>
                  <p className="text-gray-600 mb-2">{activity.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Date: {new Date(activity.date).toLocaleDateString()}</span>
                    <span>Qty: {activity.quantity}</span>
                    <span>Unit Price: ${activity.unit_price}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditActivity(activity)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteActivity(activity.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Activity Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="text-xl font-bold text-red-600">${activity.total_price.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Workers Involved</p>
                  <p className="text-sm text-gray-800">
                    {activity.workers_involved ? JSON.parse(activity.workers_involved).length : 0} workers
                  </p>
                </div>
              </div>

              {/* Approve Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleApproveActivity(activity)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Approve Activity (${activity.total_price})
                </button>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new activity.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Activity Modal */}
      {showAddActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingActivity ? 'Edit Activity' : 'Add New Activity'}
            </h3>
            
            <form onSubmit={handleSubmitActivity} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={activityForm.date}
                    onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity Name</label>
                  <input
                    type="text"
                    required
                    value={activityForm.activity_name}
                    onChange={(e) => setActivityForm({ ...activityForm, activity_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={activityForm.quantity}
                    onChange={(e) => setActivityForm({ ...activityForm, quantity: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={activityForm.unit_price}
                    onChange={(e) => setActivityForm({ ...activityForm, unit_price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Workers Involved</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {workers.map((worker) => (
                    <label key={worker.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activityForm.workers_involved.includes(worker.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setActivityForm({
                              ...activityForm,
                              workers_involved: [...activityForm.workers_involved, worker.id]
                            });
                          } else {
                            setActivityForm({
                              ...activityForm,
                              workers_involved: activityForm.workers_involved.filter(id => id !== worker.id)
                            });
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm">{worker.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Total Price:</strong> ${(activityForm.quantity * activityForm.unit_price).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddActivity(false);
                    setEditingActivity(null);
                    setActivityForm({
                      date: new Date().toISOString().split('T')[0],
                      activity_name: '',
                      description: '',
                      quantity: 1,
                      unit_price: 0,
                      total_price: 0,
                      workers_involved: []
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {editingActivity ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyActivitiesPage;

