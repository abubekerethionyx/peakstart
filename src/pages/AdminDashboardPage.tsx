"use client";

import React, { useEffect, useState } from "react";
import { getAllProjects, getContactSubmissions, getBlogPosts, getAllServices, getTeamMembers, getHomeTestimonials, getCertifications, getAwards, getHomeStats } from "../services/api";

interface DashboardData {
  totalProjects: number;
  newContactSubmissions: number;
  activeBlogPosts: number;
  totalServices: number;
  totalTeamMembers: number;
  totalTestimonials: number;
  totalCertifications: number;
  totalAwards: number;
  totalCompanyStats: number;
}

const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [projectsRes, contactsRes, blogRes, servicesRes, teamRes, testimonialsRes, certsRes, awardsRes, statsRes] = await Promise.all([
          getAllProjects(),
          getContactSubmissions(),
          getBlogPosts(),
          getAllServices(),
          getTeamMembers(),
          getHomeTestimonials(),
          getCertifications(),
          getAwards(),
          getHomeStats(),
        ]);

        const totalProjects = projectsRes.success && Array.isArray(projectsRes.data) ? projectsRes.data.length : 0;
        const newContactSubmissions = contactsRes.success && Array.isArray(contactsRes.data) ? contactsRes.data.length : 0;
        const activeBlogPosts = blogRes.success && Array.isArray(blogRes.data) ? blogRes.data.length : 0;
        const totalServices = servicesRes.success && Array.isArray(servicesRes.data) ? servicesRes.data.length : 0;
        const totalTeamMembers = teamRes.success && Array.isArray(teamRes.data) ? teamRes.data.length : 0;
        const totalTestimonials = testimonialsRes.success && Array.isArray(testimonialsRes.data) ? testimonialsRes.data.length : 0;
        const totalCertifications = certsRes.success && Array.isArray(certsRes.data) ? certsRes.data.length : 0;
        const totalAwards = awardsRes.success && Array.isArray(awardsRes.data) ? awardsRes.data.length : 0;
        const totalCompanyStats = statsRes.success && Array.isArray(statsRes.data) ? statsRes.data.length : 0;

        setData({
          totalProjects,
          newContactSubmissions,
          activeBlogPosts,
          totalServices,
          totalTeamMembers,
          totalTestimonials,
          totalCertifications,
          totalAwards,
          totalCompanyStats,
        });

        // Log warnings for any partial failures to help debugging
        const responses = [projectsRes, contactsRes, blogRes, servicesRes, teamRes, testimonialsRes, certsRes, awardsRes, statsRes];
        const failed = responses.filter(r => !r.success).map(r => r.error).filter(Boolean);
        if (failed.length) console.warn('Some dashboard endpoints failed:', failed);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="text-gray-600">Loading dashboard...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard Overview</h2>
      <p className="text-lg text-gray-700 mb-4">
        Welcome to the Peakstart General Construction Admin Panel. Use the sidebar to manage different sections.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-blue-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-blue-800">Total Projects</h3>
          <p className="text-2xl font-bold text-blue-900">{data?.totalProjects ?? 0}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-green-800">Contact Submissions</h3>
          <p className="text-2xl font-bold text-green-900">{data?.newContactSubmissions ?? 0}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-yellow-800">Active Blog Posts</h3>
          <p className="text-2xl font-bold text-yellow-900">{data?.activeBlogPosts ?? 0}</p>
        </div>
        <div className="bg-indigo-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-indigo-800">Services</h3>
          <p className="text-2xl font-bold text-indigo-900">{data?.totalServices ?? 0}</p>
        </div>
        <div className="bg-pink-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-pink-800">Team Members</h3>
          <p className="text-2xl font-bold text-pink-900">{data?.totalTeamMembers ?? 0}</p>
        </div>
        <div className="bg-emerald-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-emerald-800">Testimonials</h3>
          <p className="text-2xl font-bold text-emerald-900">{data?.totalTestimonials ?? 0}</p>
        </div>
        <div className="bg-amber-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-amber-800">Certifications</h3>
          <p className="text-2xl font-bold text-amber-900">{data?.totalCertifications ?? 0}</p>
        </div>
        <div className="bg-rose-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-rose-800">Awards</h3>
          <p className="text-2xl font-bold text-rose-900">{data?.totalAwards ?? 0}</p>
        </div>
        <div className="bg-slate-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-slate-800">Company Stats</h3>
          <p className="text-2xl font-bold text-slate-900">{data?.totalCompanyStats ?? 0}</p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Go to{" "}
            <a href="/admin/services" className="text-blue-600 hover:underline">
              Manage Services
            </a>
          </li>
          <li>
            Go to{" "}
            <a href="/admin/projects" className="text-blue-600 hover:underline">
              Manage Projects
            </a>
          </li>
          <li>
            Go to{" "}
            <a href="/admin/contactsubmissions" className="text-blue-600 hover:underline">
              View Contact Submissions
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
