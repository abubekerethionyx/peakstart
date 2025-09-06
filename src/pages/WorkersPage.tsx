import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkers, createWorker, updateWorker, deleteWorker, createCost, api } from '../services/api';

interface Worker {
  id: number;
  name: string;
  position: string;
  daily_price: number;
  phone: string;
  email: string;
  is_active: boolean;
  site_id: number;
  site_name: string;
}

interface Attendance {
  id: number;
  worker_id: number;
  worker_name: string;
  date: string;
  check_in_time: string;
  check_out_time: string;
  hours_worked: number;
  is_present: boolean;
  notes: string;
}

interface WorkerWithAttendance extends Worker {
  attendances: Attendance[];
  totalDays: number;
  totalHours: number;
  totalCost: number;
}

const WorkersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<WorkerWithAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [showAddAttendance, setShowAddAttendance] = useState(false);
  const [selectedWorkerForAttendance, setSelectedWorkerForAttendance] = useState<Worker | null>(null);
  const [workerForm, setWorkerForm] = useState({
    name: '',
    position: '',
    daily_price: 0,
    phone: '',
    email: '',
    is_active: true
  });
  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date().toISOString().split('T')[0],
    check_in_time: '08:00',
    check_out_time: '17:00',
    hours_worked: 8,
    is_present: true,
    notes: ''
  });

  useEffect(() => {
    if (id) {
      fetchWorkersData();
    }
  }, [id, dateFilter, customStartDate, customEndDate, selectedDate]);

  const fetchWorkersData = async () => {
    try {
      setLoading(true);
      
      // Fetch workers for this site
      const workersResponse = await getWorkers(parseInt(id!));
      if (!workersResponse.success) return;

      const workersData = workersResponse.data || [];
      
      // Fetch attendance data for each worker based on filters
      const workersWithAttendance: WorkerWithAttendance[] = await Promise.all(
        workersData.map(async (worker: Worker) => {
          let attendanceUrl = `/attendance?worker_id=${worker.id}`;
          
          // Apply date filters
          if (dateFilter === 'today') {
            attendanceUrl += `&date=${selectedDate}`;
          } else if (dateFilter === 'week') {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - 7);
            attendanceUrl += `&start_date=${weekStart.toISOString().split('T')[0]}`;
          } else if (dateFilter === 'month') {
            const monthStart = new Date();
            monthStart.setMonth(monthStart.getMonth() - 1);
            attendanceUrl += `&start_date=${monthStart.toISOString().split('T')[0]}`;
          } else if (dateFilter === 'custom' && customStartDate && customEndDate) {
            attendanceUrl += `&start_date=${customStartDate}&end_date=${customEndDate}`;
          }

          const attendanceResponse = await api.get(attendanceUrl);
          const attendances = attendanceResponse.data.success ? attendanceResponse.data.data : [];

          // Calculate totals
          const totalDays = attendances.filter((a: Attendance) => a.is_present).length;
          const totalHours = attendances.reduce((sum: number, a: Attendance) => sum + a.hours_worked, 0);
          const totalCost = totalDays * worker.daily_price;

          return {
            ...worker,
            attendances,
            totalDays,
            totalHours,
            totalCost
          };
        })
      );

      setWorkers(workersWithAttendance);
    } catch (error) {
      console.error('Error fetching workers data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWorker) {
        await updateWorker(editingWorker.id, workerForm);
      } else {
        await createWorker({ ...workerForm, site_id: parseInt(id!) });
      }
      setShowAddWorker(false);
      setEditingWorker(null);
      setWorkerForm({
        name: '',
        position: '',
        daily_price: 0,
        phone: '',
        email: '',
        is_active: true
      });
      fetchWorkersData();
    } catch (error) {
      console.error('Error saving worker:', error);
    }
  };

  const handleEditWorker = (worker: Worker) => {
    setEditingWorker(worker);
    setWorkerForm({
      name: worker.name,
      position: worker.position,
      daily_price: worker.daily_price,
      phone: worker.phone || '',
      email: worker.email || '',
      is_active: worker.is_active
    });
    setShowAddWorker(true);
  };

  const handleDeleteWorker = async (workerId: number) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await deleteWorker(workerId);
        fetchWorkersData();
      } catch (error) {
        console.error('Error deleting worker:', error);
      }
    }
  };

  const handleApproveWorker = async (worker: WorkerWithAttendance) => {
    if (window.confirm(`Approve ${worker.totalDays} days of work for ${worker.name}? Total cost: $${worker.totalCost}`)) {
      try {
        // Create cost record for approved worker
        await createCost({
          site_id: parseInt(id!),
          worker_id: worker.id,
          cost_type: 'worker',
          description: `Approved work for ${worker.name} - ${worker.totalDays} days`,
          amount: worker.totalCost,
          date: new Date().toISOString().split('T')[0],
          category: 'labor'
        });
        
        // Mark attendances as approved (you might want to add an 'approved' field to attendance model)
        alert('Worker approved and cost created successfully!');
        fetchWorkersData();
      } catch (error) {
        console.error('Error approving worker:', error);
      }
    }
  };

  const handleSubmitAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerForAttendance) return;

    try {
      await api.post('/attendance', {
        worker_id: selectedWorkerForAttendance.id,
        date: attendanceForm.date,
        check_in_time: attendanceForm.check_in_time,
        check_out_time: attendanceForm.check_out_time,
        hours_worked: attendanceForm.hours_worked,
        is_present: attendanceForm.is_present,
        notes: attendanceForm.notes
      });

      setShowAddAttendance(false);
      setSelectedWorkerForAttendance(null);
      setAttendanceForm({
        date: new Date().toISOString().split('T')[0],
        check_in_time: '08:00',
        check_out_time: '17:00',
        hours_worked: 8,
        is_present: true,
        notes: ''
      });
      fetchWorkersData();
    } catch (error) {
      console.error('Error adding attendance:', error);
    }
  };

  const handleAddAttendance = (worker: Worker) => {
    setSelectedWorkerForAttendance(worker);
    setAttendanceForm({
      date: new Date().toISOString().split('T')[0],
      check_in_time: '08:00',
      check_out_time: '17:00',
      hours_worked: 8,
      is_present: true,
      notes: ''
    });
    setShowAddAttendance(true);
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

  const totalSiteCost = workers.reduce((sum, worker) => sum + worker.totalCost, 0);

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
            <h2 className="text-3xl font-bold text-gray-800">Workers Management</h2>
            <p className="text-gray-600">Manage workers and track attendance</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddWorker(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Worker
          </button>
          <button
            onClick={() => {
              // Show attendance modal for today's date
              setAttendanceForm({
                date: new Date().toISOString().split('T')[0],
                check_in_time: '08:00',
                check_out_time: '17:00',
                hours_worked: 8,
                is_present: true,
                notes: ''
              });
              setShowAddAttendance(true);
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add Attendance
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Filter Attendance Data</h3>
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
        
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Showing data for:</strong> {getDateRangeText()}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Days Worked</p>
              <p className="text-2xl font-semibold text-gray-900">
                {workers.reduce((sum, worker) => sum + worker.totalDays, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Hours</p>
              <p className="text-2xl font-semibold text-gray-900">
                {workers.reduce((sum, worker) => sum + worker.totalHours, 0).toFixed(1)}
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
              <p className="text-2xl font-semibold text-gray-900">${totalSiteCost.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workers List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Workers List</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {workers.map((worker) => (
            <div key={worker.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">{worker.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      worker.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {worker.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">{worker.position}</p>
                  <p className="text-sm text-gray-500">${worker.daily_price}/day</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddAttendance(worker)}
                    className="text-green-600 hover:text-green-800 p-2"
                    title="Add Attendance"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditWorker(worker)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Edit Worker"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteWorker(worker.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete Worker"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Worker Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{worker.totalDays}</p>
                  <p className="text-sm text-gray-600">Days Worked</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{worker.totalHours.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Total Hours</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">${worker.totalCost.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Cost</p>
                </div>
              </div>

              {/* Recent Attendance */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Attendance</h5>
                <div className="space-y-2">
                  {worker.attendances.slice(0, 3).map((attendance) => (
                    <div key={attendance.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                      <span>{new Date(attendance.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-4">
                        <span className={attendance.is_present ? 'text-green-600' : 'text-red-600'}>
                          {attendance.is_present ? 'Present' : 'Absent'}
                        </span>
                        {attendance.hours_worked > 0 && (
                          <span className="text-gray-600">{attendance.hours_worked}h</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {worker.attendances.length === 0 && (
                    <p className="text-sm text-gray-500">No attendance records found</p>
                  )}
                </div>
              </div>

              {/* Approve Button */}
              {worker.totalDays > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleApproveWorker(worker)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Approve Work (${worker.totalCost})
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {workers.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No workers</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new worker.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Worker Modal */}
      {showAddWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingWorker ? 'Edit Worker' : 'Add New Worker'}
            </h3>
            
            <form onSubmit={handleSubmitWorker} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={workerForm.name}
                  onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  required
                  value={workerForm.position}
                  onChange={(e) => setWorkerForm({ ...workerForm, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Price ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={workerForm.daily_price}
                  onChange={(e) => setWorkerForm({ ...workerForm, daily_price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={workerForm.phone}
                  onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={workerForm.email}
                  onChange={(e) => setWorkerForm({ ...workerForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={workerForm.is_active}
                  onChange={(e) => setWorkerForm({ ...workerForm, is_active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddWorker(false);
                    setEditingWorker(null);
                    setWorkerForm({
                      name: '',
                      position: '',
                      daily_price: 0,
                      phone: '',
                      email: '',
                      is_active: true
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingWorker ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Attendance Modal */}
      {showAddAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Add Attendance {selectedWorkerForAttendance && `for ${selectedWorkerForAttendance.name}`}
            </h3>
            
            <form onSubmit={handleSubmitAttendance} className="space-y-4">
              {!selectedWorkerForAttendance && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Worker</label>
                  <select
                    required
                    value=""
                    onChange={(e) => {
                      const worker = workers.find(w => w.id === parseInt(e.target.value));
                      setSelectedWorkerForAttendance(worker || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a worker</option>
                    {workers.map((worker) => (
                      <option key={worker.id} value={worker.id}>
                        {worker.name} - {worker.position}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={attendanceForm.date}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_present"
                  checked={attendanceForm.is_present}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, is_present: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_present" className="ml-2 block text-sm text-gray-900">
                  Present
                </label>
              </div>

              {attendanceForm.is_present && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check In Time</label>
                      <input
                        type="time"
                        value={attendanceForm.check_in_time}
                        onChange={(e) => setAttendanceForm({ ...attendanceForm, check_in_time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check Out Time</label>
                      <input
                        type="time"
                        value={attendanceForm.check_out_time}
                        onChange={(e) => setAttendanceForm({ ...attendanceForm, check_out_time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={attendanceForm.hours_worked}
                      onChange={(e) => setAttendanceForm({ ...attendanceForm, hours_worked: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={attendanceForm.notes}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional notes..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAttendance(false);
                    setSelectedWorkerForAttendance(null);
                    setAttendanceForm({
                      date: new Date().toISOString().split('T')[0],
                      check_in_time: '08:00',
                      check_out_time: '17:00',
                      hours_worked: 8,
                      is_present: true,
                      notes: ''
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
                  Add Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkersPage;
