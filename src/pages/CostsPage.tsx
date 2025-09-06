import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkers, getDailyActivities, getCosts, createCost, updateCost, deleteCost } from '../services/api';

interface Cost {
  id: number;
  site_id: number;
  site_name: string;
  worker_id?: number;
  worker_name?: string;
  daily_activity_id?: number;
  activity_name?: string;
  cost_type: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
}

const CostsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [costs, setCosts] = useState<Cost[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [costTypeFilter, setCostTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddCost, setShowAddCost] = useState(false);
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  const [costForm, setCostForm] = useState({
    cost_type: 'other',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '',
    worker_id: '',
    daily_activity_id: ''
  });

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, dateFilter, customStartDate, customEndDate, selectedDate, costTypeFilter, categoryFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch workers and activities for this site
      const [workersResponse, activitiesResponse] = await Promise.all([
        getWorkers(parseInt(id!)),
        getDailyActivities(parseInt(id!))
      ]);
      
      if (workersResponse.success) {
        setWorkers(workersResponse.data || []);
      }
      if (activitiesResponse.success) {
        setActivities(activitiesResponse.data || []);
      }

      // Fetch costs for this site with filters
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

      const costsResponse = await getCosts(
        parseInt(id!),
        undefined, // workerId
        costTypeFilter !== 'all' ? costTypeFilter : undefined,
        categoryFilter !== 'all' ? categoryFilter : undefined,
        startDate,
        endDate,
        date
      );
      if (costsResponse.success) {
        setCosts(costsResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        ...costForm,
        site_id: parseInt(id!),
        amount: parseFloat(costForm.amount.toString()),
        worker_id: costForm.worker_id ? parseInt(costForm.worker_id) : null,
        daily_activity_id: costForm.daily_activity_id ? parseInt(costForm.daily_activity_id) : null
      };

      if (editingCost) {
        await updateCost(editingCost.id, formData);
      } else {
        await createCost(formData);
      }
      
      setShowAddCost(false);
      setEditingCost(null);
      setCostForm({
        cost_type: 'other',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: '',
        worker_id: '',
        daily_activity_id: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error saving cost:', error);
    }
  };

  const handleEditCost = (cost: Cost) => {
    setEditingCost(cost);
    setCostForm({
      cost_type: cost.cost_type,
      description: cost.description,
      amount: cost.amount,
      date: cost.date,
      category: cost.category || '',
      worker_id: cost.worker_id?.toString() || '',
      daily_activity_id: cost.daily_activity_id?.toString() || ''
    });
    setShowAddCost(true);
  };

  const handleDeleteCost = async (costId: number) => {
    if (window.confirm('Are you sure you want to delete this cost?')) {
      try {
        await deleteCost(costId);
        fetchData();
      } catch (error) {
        console.error('Error deleting cost:', error);
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

  const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, 0);
  const costTypes = ['worker', 'activity', 'material', 'equipment', 'other'];
  const categories = ['labor', 'materials', 'equipment', 'overhead', 'transportation', 'utilities'];

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
            <h2 className="text-3xl font-bold text-gray-800">Costs Management</h2>
            <p className="text-gray-600">Track and manage all site costs</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddCost(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Cost
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Filter Costs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Type</label>
            <select
              value={costTypeFilter}
              onChange={(e) => setCostTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {costTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-red-50 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Showing data for:</strong> {getDateRangeText()}
            {costTypeFilter !== 'all' && ` • Type: ${costTypeFilter}`}
            {categoryFilter !== 'all' && ` • Category: ${categoryFilter}`}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Costs</p>
              <p className="text-2xl font-semibold text-gray-900">{costs.length}</p>
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
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-2xl font-semibold text-gray-900">${totalCosts.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Worker Costs</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${costs.filter(c => c.cost_type === 'worker').reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Activity Costs</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${costs.filter(c => c.cost_type === 'activity').reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Costs List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Costs List</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {costs.map((cost) => (
            <div key={cost.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">{cost.description}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      cost.cost_type === 'worker' ? 'bg-blue-100 text-blue-800' :
                      cost.cost_type === 'activity' ? 'bg-green-100 text-green-800' :
                      cost.cost_type === 'material' ? 'bg-yellow-100 text-yellow-800' :
                      cost.cost_type === 'equipment' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {cost.cost_type}
                    </span>
                    {cost.category && (
                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                        {cost.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Date: {new Date(cost.date).toLocaleDateString()}</span>
                    {cost.worker_name && <span>Worker: {cost.worker_name}</span>}
                    {cost.activity_name && <span>Activity: {cost.activity_name}</span>}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">${cost.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCost(cost)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteCost(cost.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {costs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No costs</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new cost.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Cost Modal */}
      {showAddCost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingCost ? 'Edit Cost' : 'Add New Cost'}
            </h3>
            
            <form onSubmit={handleSubmitCost} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Type</label>
                  <select
                    required
                    value={costForm.cost_type}
                    onChange={(e) => setCostForm({ ...costForm, cost_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {costTypes.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={costForm.category}
                    onChange={(e) => setCostForm({ ...costForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={costForm.description}
                  onChange={(e) => setCostForm({ ...costForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={costForm.amount}
                    onChange={(e) => setCostForm({ ...costForm, amount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={costForm.date}
                    onChange={(e) => setCostForm({ ...costForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {costForm.cost_type === 'worker' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Related Worker</label>
                  <select
                    value={costForm.worker_id}
                    onChange={(e) => setCostForm({ ...costForm, worker_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Worker</option>
                    {workers.map(worker => (
                      <option key={worker.id} value={worker.id}>{worker.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {costForm.cost_type === 'activity' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Related Activity</label>
                  <select
                    value={costForm.daily_activity_id}
                    onChange={(e) => setCostForm({ ...costForm, daily_activity_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Activity</option>
                    {activities.map(activity => (
                      <option key={activity.id} value={activity.id}>{activity.activity_name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCost(false);
                    setEditingCost(null);
                    setCostForm({
                      cost_type: 'other',
                      description: '',
                      amount: 0,
                      date: new Date().toISOString().split('T')[0],
                      category: '',
                      worker_id: '',
                      daily_activity_id: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  {editingCost ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostsPage;

