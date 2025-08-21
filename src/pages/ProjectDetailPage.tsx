import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowLeft, CheckCircle } from 'lucide-react';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock project data - in a real app, this would come from an API
  const projects = {
    '1': {
      title: "Modern Office Complex",
      category: "Commercial",
      location: "Downtown District",
      completionDate: "December 2024",
      client: "Metro Corp",
      duration: "18 months",
      projectValue: "$12.5M",
      teamSize: "25 professionals",
      mainImage: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg",
      images: [
        "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
        "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg",
        "https://images.pexels.com/photos/323772/pexels-photo-323772.jpeg"
      ],
      description: "This state-of-the-art 15-story office building represents the pinnacle of modern commercial construction. Located in the heart of the downtown district, this project combines sustainable building practices with cutting-edge design to create a workspace that promotes productivity and well-being.",
      features: [
        "LEED Gold certified sustainable design",
        "Smart building technology integration",
        "Energy-efficient HVAC systems",
        "Floor-to-ceiling windows for natural light",
        "Rooftop garden and recreational areas",
        "Underground parking for 200+ vehicles",
        "High-speed elevator systems",
        "Advanced fire safety and security systems"
      ],
      challenges: "The main challenges included working within a confined urban space, coordinating with multiple utilities, and maintaining business operations in surrounding buildings during construction.",
      solution: "We implemented a phased construction approach with careful scheduling, used advanced crane technology for material handling, and maintained constant communication with neighboring businesses to minimize disruption.",
      testimonial: {
        text: "BuildCorp exceeded our expectations in every aspect. The project was completed on time, within budget, and the quality of work is exceptional. The building has become a landmark in our downtown area.",
        author: "James Mitchell",
        title: "CEO, Metro Corp"
      }
    },
    // Add more projects as needed...
  };

  const project = projects[id as keyof typeof projects];

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Link to="/portfolio" className="text-orange-500 hover:text-orange-600">
            Return to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={project.mainImage}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-8 left-8 text-white">
          <Link
            to="/portfolio"
            className="inline-flex items-center space-x-2 text-white hover:text-orange-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Portfolio</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{project.title}</h1>
          <div className="flex items-center space-x-4 text-lg">
            <span className="bg-orange-500 px-3 py-1 rounded-full text-sm">
              {project.category}
            </span>
            <span>{project.location}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Overview */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Additional Images */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {project.images.map((image, index) => (
                  <div key={index} className="relative overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Key Features */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Challenges & Solutions */}
            <section className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Challenges</h3>
                  <p className="text-gray-700 leading-relaxed">{project.challenges}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
                  <p className="text-gray-700 leading-relaxed">{project.solution}</p>
                </div>
              </div>
            </section>

            {/* Client Testimonial */}
            <section className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Client Testimonial</h3>
              <blockquote className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                "{project.testimonial.text}"
              </blockquote>
              <div className="border-t pt-6">
                <p className="font-semibold text-gray-900">{project.testimonial.author}</p>
                <p className="text-gray-600">{project.testimonial.title}</p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-lg shadow-lg sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-medium text-gray-900">{project.client}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{project.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Completion Date</p>
                    <p className="font-medium text-gray-900">{project.completionDate}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Project Duration</p>
                      <p className="font-medium text-gray-900">{project.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Project Value</p>
                      <p className="font-medium text-gray-900">{project.projectValue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Team Size</p>
                      <p className="font-medium text-gray-900">{project.teamSize}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Interested in a Similar Project?</h4>
                <Link
                  to="/contact"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-300"
                >
                  Get a Free Quote
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">More Projects</h2>
          <div className="text-center">
            <Link
              to="/portfolio"
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              View All Projects
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetailPage;