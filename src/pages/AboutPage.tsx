import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Clock, CheckCircle, Target, Eye, Heart } from 'lucide-react';
import { getHomeStats, getTeamMembers, getCertifications, getAwards } from '../services/api';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  experience: string;
  image: string;
  bio: string;
}

interface CompanyStat {
  id: number;
  number: string;
  label: string;
  icon_name: string;
  icon?: React.ComponentType<any>; // Add icon property for the mapped component
}

interface Certification {
  id: number;
  name: string;
}

interface Award {
  id: number;
  name: string;
  year: string;
}

const AboutPage: React.FC = () => {
  const [stats, setStats] = useState<CompanyStat[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch stats
        const statsResponse = await getHomeStats();
        if (statsResponse.success) {
          setStats(statsResponse.data?.map((stat: any) => ({
            ...stat,
            icon: stat.icon_name === "Clock" ? Clock : stat.icon_name === "CheckCircle" ? CheckCircle : stat.icon_name === "Users" ? Users : Award
          })) || []);
        } else {
          console.error('Failed to fetch stats:', statsResponse.error);
        }

        // Fetch team members
        const teamResponse = await getTeamMembers();
        if (teamResponse.success) {
          setTeamMembers(teamResponse.data || []);
        } else {
          console.error('Failed to fetch team members:', teamResponse.error);
        }

        // Fetch certifications
        const certResponse = await getCertifications();
        if (certResponse.success) {
          setCertifications(certResponse.data || []);
        } else {
          console.error('Failed to fetch certifications:', certResponse.error);
        }

        // Fetch awards
        const awardsResponse = await getAwards();
        if (awardsResponse.success) {
          setAwards(awardsResponse.data || []);
        } else {
          console.error('Failed to fetch awards:', awardsResponse.error);
        }

      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading about page data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">About Peakstart General Construction</h1>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                For over 5 years, we've been building more than structures –
                we've been building relationships, communities, and a legacy of excellence
                in the construction industry.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg"
                alt="Peakstart General Construction team"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  {IconComponent && <IconComponent className="w-12 h-12 text-orange-500 mx-auto mb-4" />}
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our mission is to deliver exceptional construction solutions that exceed client expectations,
                build lasting relationships, and contribute positively to the communities we serve.
                We are committed to innovation, quality, and sustainable practices in every project we undertake.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Target className="w-6 h-6 text-orange-500" />
                  <span>Client-Centric Approach</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Uncompromising Quality</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span>Community Engagement</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To be the leading Peakstart General Construction renowned for our integrity, innovation,
                and the ability to transform visions into reality. We envision a future where
                our structures not only stand tall but also inspire and endure for generations.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Eye className="w-6 h-6 text-blue-500" />
                  <span>Innovative Solutions</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <span>Excellence in Craftsmanship</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Sustainable Future</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our strength lies in our people. Meet the dedicated professionals who make every project a success.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden text-center group">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-orange-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                  <p className="text-gray-500 text-xs mt-2">Experience: {member.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Awards Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Certifications</h2>
              <ul className="space-y-3">
                {certifications.map((cert) => (
                  <li key={cert.id} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-lg text-gray-700">{cert.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Awards & Recognitions</h2>
              <ul className="space-y-3">
                {awards.map((award) => (
                  <li key={award.id} className="flex items-center space-x-3">
                    <Award className="w-6 h-6 text-yellow-500" />
                    <span className="text-lg text-gray-700">{award.name} ({award.year})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Join Our Growing Family of Satisfied Clients</h2>
          <p className="text-xl mb-8 text-gray-300">
            Ready to experience the Peakstart General Construction difference? Contact us today to discuss your next project.
          </p>
          <Link
            to="/contact"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300"
          >
            Get a Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;