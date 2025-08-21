import React, { useEffect, useState } from 'react';
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
import { getAllServices } from '../services/api';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState([]);
  const [processSteps, setProcessSteps] = useState([
    {
      step: "01",
      title: "Consultation",
      description: "We start with a detailed consultation to understand your vision, requirements, and budget."
    },
    {
      step: "02",
      title: "Planning & Design",
      description: "Our experts develop a comprehensive plan and design tailored to your specifications."
    },
    {
      step: "03",
      title: "Construction",
      description: "We execute the project with precision, adhering to the highest quality and safety standards."
    },
    {
      step: "04",
      title: "Completion & Handover",
      description: "The project is completed, thoroughly inspected, and handed over to you, ready for use."
    }
  ]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await getAllServices();
      if (response.success) {
        setServices(response.data?.map((service: any) => ({
          ...service,
          icon: service.icon_name === "Building" ? Building : service.icon_name === "Wrench" ? Wrench : service.icon_name === "PaintBucket" ? PaintBucket : service.icon_name === "HardHat" ? HardHat : service.icon_name === "Route" ? Route : Clipboard
        })) || []);
      } else {
        console.error('Error fetching services:', response.error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive construction solutions for every need, from concept to completion.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: any, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 text-center group transition-transform duration-300 hover:scale-[1.02]">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 group-hover:bg-orange-500">
                  <IconComponent className="w-10 h-10 text-orange-500 transition-colors duration-300 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="text-left text-gray-700 space-y-2 mb-6">
                  {service.features.map((feature: string, fIndex: number) => (
                    <li key={fIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium"
                >
                  <span>Get a Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Process</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We follow a streamlined and transparent process to ensure every project is completed efficiently and to the highest standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-50 p-8 rounded-lg h-full">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Get in touch with us today for a free consultation and a detailed quote.
            Let's build your vision together.
          </p>
          <Link
            to="/contact"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;