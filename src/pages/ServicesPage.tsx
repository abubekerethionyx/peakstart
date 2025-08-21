import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Wrench, 
  PaintBucket, 
  HardHat, 
  Route, 
  Clipboard,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const ServicesPage: React.FC = () => {
  const services = [
    {
      icon: Building,
      title: "Building Construction",
      description: "Complete construction services for residential, commercial, and industrial buildings from foundation to finish.",
      features: [
        "New construction projects",
        "Foundation and structural work",
        "Commercial buildings",
        "Residential complexes",
        "Quality materials and craftsmanship"
      ],
      image: "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg"
    },
    {
      icon: Wrench,
      title: "Renovation & Remodeling",
      description: "Transform your existing spaces with our comprehensive renovation and remodeling services.",
      features: [
        "Kitchen and bathroom remodeling",
        "Whole house renovations",
        "Office space upgrades",
        "Historic building restoration",
        "Energy efficiency improvements"
      ],
      image: "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg"
    },
    {
      icon: PaintBucket,
      title: "Interior Design & Finishing",
      description: "Professional interior design services to create beautiful, functional spaces tailored to your needs.",
      features: [
        "Space planning and design",
        "Custom finishes and fixtures",
        "Lighting design",
        "Flooring installation",
        "Painting and decorating"
      ],
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
    },
    {
      icon: HardHat,
      title: "Civil Engineering",
      description: "Expert civil engineering services for infrastructure projects, site development, and structural design.",
      features: [
        "Site surveying and planning",
        "Structural engineering",
        "Drainage and utility systems",
        "Environmental compliance",
        "Project feasibility studies"
      ],
      image: "https://images.pexels.com/photos/3862618/pexels-photo-3862618.jpeg"
    },
    {
      icon: Route,
      title: "Road Construction",
      description: "Professional road construction and infrastructure development services for public and private projects.",
      features: [
        "Highway and street construction",
        "Parking lot development",
        "Sidewalks and pathways",
        "Site access roads",
        "Traffic management systems"
      ],
      image: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg"
    },
    {
      icon: Clipboard,
      title: "Project Management",
      description: "Comprehensive project management services to ensure your construction project is completed on time and within budget.",
      features: [
        "Project planning and scheduling",
        "Budget management",
        "Quality control and inspections",
        "Vendor and contractor coordination",
        "Progress reporting and communication"
      ],
      image: "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Consultation",
      description: "We start with a detailed consultation to understand your vision, requirements, and budget."
    },
    {
      step: "02",
      title: "Planning & Design",
      description: "Our team creates comprehensive plans and designs tailored to your specific needs."
    },
    {
      step: "03",
      title: "Permits & Approvals",
      description: "We handle all necessary permits, approvals, and regulatory compliance requirements."
    },
    {
      step: "04",
      title: "Construction",
      description: "Our skilled professionals execute the project with precision and attention to detail."
    },
    {
      step: "05",
      title: "Quality Assurance",
      description: "Rigorous quality checks ensure every aspect meets our high standards."
    },
    {
      step: "06",
      title: "Project Completion",
      description: "Final walkthrough, documentation, and handover of your completed project."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
            From concept to completion, we provide comprehensive construction services 
            that bring your vision to life with quality, reliability, and excellence.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-8">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                          <IconComponent className="w-6 h-6 text-orange-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-6">{service.description}</p>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/contact"
                        className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                      >
                        <span>Get Consultation</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a systematic approach to ensure every project is delivered 
              with precision, quality, and on schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-50 p-8 rounded-lg h-full">
                  <div className="text-6xl font-bold text-orange-100 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-orange-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose BuildCorp?</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">25+ Years Experience</h3>
                    <p className="text-gray-600">Decades of expertise in construction and project management across all sectors.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Licensed & Insured</h3>
                    <p className="text-gray-600">Fully licensed, bonded, and insured for your peace of mind and protection.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
                    <p className="text-gray-600">We stand behind our work with comprehensive warranties and quality assurance.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">On-Time Delivery</h3>
                    <p className="text-gray-600">Proven track record of completing projects on schedule and within budget.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg"
                alt="Construction team"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-lg shadow-xl">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Projects Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Contact us today for a free consultation and quote. Let our experienced team 
            bring your construction vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300"
            >
              Get Free Consultation
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

export default ServicesPage;