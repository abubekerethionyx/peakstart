import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Clock, CheckCircle, Target, Eye, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { number: "25+", label: "Years Experience", icon: Clock },
    { number: "500+", label: "Projects Completed", icon: CheckCircle },
    { number: "50+", label: "Team Members", icon: Users },
    { number: "15+", label: "Industry Awards", icon: Award },
  ];

  const teamMembers = [
    {
      name: "John Mitchell",
      position: "CEO & Founder",
      experience: "25+ years",
      image: "https://images.pexels.com/photos/3759124/pexels-photo-3759124.jpeg",
      bio: "Visionary leader with extensive experience in construction management and business development."
    },
    {
      name: "Sarah Thompson",
      position: "Chief Project Manager",
      experience: "18+ years",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg",
      bio: "Expert in large-scale project coordination and quality assurance across all construction phases."
    },
    {
      name: "Michael Rodriguez",
      position: "Head of Engineering",
      experience: "22+ years",
      image: "https://images.pexels.com/photos/3760809/pexels-photo-3760809.jpeg",
      bio: "Licensed civil engineer specializing in structural design and infrastructure development."
    },
    {
      name: "Emily Chen",
      position: "Design Director",
      experience: "15+ years",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg",
      bio: "Creative professional combining architectural expertise with sustainable design principles."
    },
    {
      name: "David Williams",
      position: "Safety Coordinator",
      experience: "20+ years",
      image: "https://images.pexels.com/photos/3759124/pexels-photo-3759124.jpeg",
      bio: "Dedicated to maintaining the highest safety standards on all construction sites."
    },
    {
      name: "Lisa Anderson",
      position: "Quality Control Manager",
      experience: "16+ years",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg",
      bio: "Ensures every project meets our rigorous quality standards and client expectations."
    }
  ];

  const certifications = [
    "LEED Certified Professionals",
    "OSHA Safety Certified",
    "Licensed General Contractors",
    "Bonded & Insured",
    "Green Building Council Members",
    "Construction Industry Institute"
  ];

  const awards = [
    "Excellence in Construction Award 2024",
    "Best Commercial Project 2023",
    "Safety Achievement Award 2023",
    "Sustainable Building Award 2022",
    "Innovation in Construction 2022"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">About BuildCorp</h1>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                For over 25 years, we've been building more than structures – 
                we've been building relationships, communities, and a legacy of excellence 
                in the construction industry.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg"
                alt="BuildCorp team"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <IconComponent className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-blue-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Founded in 1999 by John Mitchell, BuildCorp began as a small residential 
                construction company with a simple mission: to build quality structures that 
                stand the test of time while treating every client like family.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Over the years, we've grown from a handful of dedicated professionals to a 
                full-service construction company with over 50 team members. Our expansion 
                into commercial, industrial, and infrastructure projects has been guided by 
                our core values of quality, integrity, and innovation.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, BuildCorp stands as a testament to what's possible when you combine 
                skilled craftsmanship with modern technology and unwavering commitment to 
                customer satisfaction.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg"
                alt="BuildCorp history"
                className="rounded-lg shadow-lg"
              />
              <img
                src="https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg"
                alt="BuildCorp projects"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To deliver exceptional construction services that exceed client expectations 
                while maintaining the highest standards of safety, quality, and environmental responsibility.
              </p>
            </div>

            <div className="text-center p-8 bg-orange-50 rounded-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To be the leading construction company in our region, recognized for innovation, 
                sustainability, and our positive impact on the communities we serve.
              </p>
            </div>

            <div className="text-center p-8 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <p className="text-gray-700 leading-relaxed">
                Integrity, quality craftsmanship, safety first, environmental stewardship, 
                and building lasting relationships with our clients and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced leadership team brings decades of industry expertise and 
              a shared commitment to excellence in every project we undertake.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                    {member.experience}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-orange-500 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Awards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Certifications & Licenses</h2>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Awards</h2>
              <div className="space-y-4">
                {awards.map((award, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Award className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">{award}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join the hundreds of satisfied clients who have trusted BuildCorp with their 
            construction needs. Let's build something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300"
            >
              Start Your Project
            </Link>
            <Link
              to="/portfolio"
              className="border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;