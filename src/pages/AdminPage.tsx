import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import ServiceForm from '../components/admin/ServiceForm';
import ProjectForm from '../components/admin/ProjectForm';
import BlogPostForm from '../components/admin/BlogPostForm';
import TeamMemberForm from '../components/admin/TeamMemberForm';
import TestimonialForm from '../components/admin/TestimonialForm';
import CompanyStatForm from '../components/admin/CompanyStatForm';
import CertificationForm from '../components/admin/CertificationForm';
import AwardForm from '../components/admin/AwardForm';

const AdminPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/signin');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-6">
        <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <Link
            to="/admin"
            className={`block px-4 py-2 rounded-lg text-lg transition-colors duration-200 ${location.pathname === '/admin' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/services"
            className={`block px-4 py-2 rounded-lg text-lg transition-colors duration-200 ${location.pathname === '/admin/services' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
          >
            Services
          </Link>
          <Link
            to="/admin/projects"
            className={`block px-4 py-2 rounded-lg text-lg transition-colors duration-200 ${location.pathname === '/admin/projects' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
          >
            Projects
          </Link>
          <Link
            to="/admin/blogposts"
            className={`block px-4 py-2 rounded-lg text-lg transition-colors duration-200 ${location.pathname === '/admin/blogposts' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
          >
            Blog Posts
          </Link>
          <Link
            to="/admin/team"
            className={`block px-4 py-2 rounded-lg text-lg transition-colors duration-200 ${location.pathname === '/admin/team' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
          >
            Team Members
          </Link>
          <Link
            to="/admin/testimonials"
            className={`block px-4 py-2 rounded-lg text-lg transition-colors duration-200 ${location.pathname === '/admin/testimonials' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
          >
            Testimonials
          </Link>
          <Link
            to="/admin/stats"
            className={`block px-4 py-2 rounded-lg text-lg transition-colors duration-200 ${location.pathname === '/admin/stats' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
          >
            Company Stats
          </Link>
          <Link
            to="/admin/certifications"
            className={`block px-4 py-2 rounded-lg text-lg transition-colors duration-200 ${location.pathname === '/admin/certifications' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
          >
            Certifications
          </Link>
          <Link
            to="/admin/awards"
            className={`block px-4 py-2 rounded-lg text-lg transition-colors duration-200 ${location.pathname === '/admin/awards' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
          >
            Awards
          </Link>
          <Link
            to="/admin/contactsubmissions"
            className={`block px-4 py-2 rounded-lg text-lg transition-colors duration-200 ${location.pathname === '/admin/contactsubmissions' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
          >
            Contact Submissions
          </Link>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>
        <Outlet />
        {
          // Removed redundant conditional rendering, Outlet handles nested routes
          // location.pathname === '/admin/services' ? <ServiceForm /> :
          // location.pathname === '/admin/projects' ? <ProjectForm /> :
          // location.pathname === '/admin/blogposts' ? <BlogPostForm /> :
          // location.pathname === '/admin/team' ? <TeamMemberForm /> :
          // location.pathname === '/admin/testimonials' ? <TestimonialForm /> :
          // location.pathname === '/admin/stats' ? <CompanyStatForm /> :
          // location.pathname === '/admin/certifications' ? <CertificationForm /> :
          // location.pathname === '/admin/awards' ? <AwardForm /> :
          // location.pathname === '/admin/contactsubmissions' ? <div>Coming Soon: Contact Submissions</div> :
          // <p>Select an item from the sidebar to manage.</p>
        }
      </main>
    </div>
  );
};

export default AdminPage;
