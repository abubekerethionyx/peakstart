import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import SignInPage from './pages/SignInPage'; // Import the new SignInPage
import ContactSubmissionsPage from './pages/ContactSubmissionsPage';
import ServiceForm from './components/admin/ServiceForm';
import ProjectForm from './components/admin/ProjectForm';
import BlogPostForm from './components/admin/BlogPostForm';
import TeamMemberForm from './components/admin/TeamMemberForm';
import TestimonialForm from './components/admin/TestimonialForm';
import CompanyStatForm from './components/admin/CompanyStatForm';
import CertificationForm from './components/admin/CertificationForm';
import AwardForm from './components/admin/AwardForm';
import AdminDashboardPage from './pages/AdminDashboardPage'; // Import AdminDashboardPage

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:id" element={<ProjectDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signin" element={<SignInPage />} /> {/* Add route for SignInPage */}
          <Route path="/admin" element={<AdminPage />}>
            {/* Nested Admin Routes */}
            <Route index element={<AdminDashboardPage />} /> {/* Default route for /admin */}
            <Route path="services" element={<div><ServiceForm/></div>} />
            <Route path="projects" element={<div><ProjectForm/></div>} />
            <Route path="blogposts" element={<div><BlogPostForm></BlogPostForm></div>} />
            <Route path="team" element={<div><TeamMemberForm/></div>} />
            <Route path="testimonials" element={<div><TestimonialForm/></div>} />
            <Route path="stats" element={<div><CompanyStatForm/></div>} />
            <Route path="certifications" element={<div><CertificationForm/></div>} />
            <Route path="awards" element={<div><AwardForm/></div>} />
            <Route path="contactsubmissions" element={<ContactSubmissionsPage />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;