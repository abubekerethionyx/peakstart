import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Award, Clock } from 'lucide-react';
import { getHomeStats, getHomeTestimonials, getHomeServices } from '../services/api';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon_name?: string;
}

interface CompanyStat {
  id: number;
  number: string;
  label: string;
  icon_name: string;
  icon?: React.ComponentType<any>; // Add icon property for the mapped component
}

interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  image: string;
}

const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<CompanyStat[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);

  // Array of background images for the hero section
  const backgroundImages = [
    'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
    'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
    'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg',
    'https://images.pexels.com/photos/323776/pexels-photo-323776.jpeg'
  ];

  // Effect for background image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackgroundIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch services
      const servicesResponse = await getHomeServices();
      if (servicesResponse.success) {
        setServices(servicesResponse.data || []);
      } else {
        console.error('Error fetching services:', servicesResponse.error);
      }

      // Fetch stats
      const statsResponse = await getHomeStats();
      if (statsResponse.success) {
        setStats(statsResponse.data?.map((stat: any) => ({
          ...stat,
          icon: stat.icon_name === "CheckCircle" ? CheckCircle : stat.icon_name === "Clock" ? Clock : stat.icon_name === "Users" ? Users : Award
        })) || []);
      } else {
        console.error('Error fetching stats:', statsResponse.error);
      }

      // Fetch testimonials
      const testimonialsResponse = await getHomeTestimonials();
      if (testimonialsResponse.success) {
        setTestimonials(testimonialsResponse.data || []);
      } else {
        console.error('Error fetching testimonials:', testimonialsResponse.error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('${backgroundImages[currentBackgroundIndex]}')`
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Building <span className="text-orange-500">Tomorrow's</span><br />
            Infrastructure Today
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            With over 5 years of experience, we deliver quality construction solutions
            that stand the test of time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/portfolio"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              View Our Work
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Free Quote
            </Link>
          </div>
        </div>
        
        {/* Background image indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBackgroundIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBackgroundIndex 
                  ? 'bg-orange-500 scale-125' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
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

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Building Dreams into Reality</h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Peakstart General Construction has been at the forefront of the construction industry for over two decades.
                We specialize in delivering high-quality residential, commercial, and industrial projects,
                always with a focus on innovation, sustainability, and client satisfaction.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Licensed & Fully Insured</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Award-Winning Team</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">24/7 Customer Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Quality Guarantee</span>
                </div>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg"
                alt="Construction team at work"
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white p-6 rounded-lg shadow-xl">
                <div className="text-3xl font-bold">5+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From residential buildings to large-scale commercial projects,
              we provide comprehensive construction services tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link
                    to="/services"
                    className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it. Here's what our satisfied clients have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Get in touch with us today for a free consultation and quote.
            Let's build something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300"
            >
              Get Free Quote
            </Link>
            <Link
              to="/portfolio"
              className="border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;