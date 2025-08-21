from app import app
from extensions import db
from models import Service, ServiceFeature, Project, BlogPost, TeamMember, Testimonial, ContactSubmission, CompanyStat, Certification, Award
from datetime import datetime

def seed_data():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Seed Services
        services_data = [
            {
                "title": "Building Construction",
                "description": "Complete construction solutions for residential and commercial projects",
                "image": "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg",
                "icon_name": "Building",
                "features": [
                    "New construction projects",
                    "Foundation and structural work",
                    "Commercial buildings",
                    "Residential complexes",
                    "Quality materials and craftsmanship"
                ]
            },
            {
                "title": "Renovation & Remodeling",
                "description": "Transform your existing spaces with our expert renovation services",
                "image": "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg",
                "icon_name": "Wrench",
                "features": [
                    "Kitchen and bathroom remodeling",
                    "Whole house renovations",
                    "Office space upgrades",
                    "Historic building restoration",
                    "Energy efficiency improvements"
                ]
            },
            {
                "title": "Civil Engineering",
                "description": "Professional engineering services for infrastructure projects",
                "image": "https://images.pexels.com/photos/3862618/pexels-photo-3862618.jpeg",
                "icon_name": "HardHat",
                "features": [
                    "Site surveying and planning",
                    "Structural engineering",
                    "Drainage and utility systems",
                    "Environmental compliance",
                    "Project feasibility studies"
                ]
            },
            {
                "title": "Interior Design & Finishing",
                "description": "Professional interior design services to create beautiful, functional spaces tailored to your needs.",
                "image": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
                "icon_name": "PaintBucket",
                "features": [
                    "Space planning and design",
                    "Custom finishes and fixtures",
                    "Lighting design",
                    "Flooring installation",
                    "Painting and decorating"
                ]
            },
            {
                "title": "Road Construction",
                "description": "Professional road construction and infrastructure development services for public and private projects.",
                "image": "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg",
                "icon_name": "Route",
                "features": [
                    "Highway and street construction",
                    "Parking lot development",
                    "Sidewalks and pathways",
                    "Site access roads",
                    "Traffic management systems"
                ]
            },
            {
                "title": "Project Management",
                "description": "Comprehensive project management services to ensure your construction project is completed on time and within budget.",
                "image": "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
                "icon_name": "Clipboard",
                "features": [
                    "Project planning and scheduling",
                    "Budget management",
                    "Quality control and inspections",
                    "Vendor and contractor coordination",
                    "Progress reporting and communication"
                ]
            }
        ]

        for s_data in services_data:
            service = Service(
                title=s_data['title'],
                description=s_data['description'],
                image=s_data['image'],
                icon_name=s_data['icon_name']
            )
            db.session.add(service)
            db.session.flush()
            for feature_text in s_data['features']:
                feature = ServiceFeature(service_id=service.id, feature=feature_text)
                db.session.add(feature)
        db.session.commit()

        # Seed Projects
        projects_data = [
            {
                "title": "Modern Office Complex",
                "category": "Commercial",
                "location": "Downtown District",
                "completionDate": "December 2024",
                "image": "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg",
                "description": "State-of-the-art 15-story office building with sustainable features and modern amenities.",
                "client": "Metro Corp"
            },
            {
                "title": "Luxury Residential Villa",
                "category": "Residential",
                "location": "Hillside Heights",
                "completionDate": "October 2024",
                "image": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
                "description": "Custom-designed luxury villa with panoramic views and premium finishes.",
                "client": "Private Client"
            },
            {
                "title": "Manufacturing Facility",
                "category": "Industrial",
                "location": "Industrial Park",
                "completionDate": "August 2024",
                "image": "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg",
                "description": "Large-scale manufacturing facility with advanced infrastructure and safety systems.",
                "client": "TechManufacturing Inc"
            },
            {
                "title": "Shopping Center Renovation",
                "category": "Commercial",
                "location": "City Center",
                "completionDate": "June 2024",
                "image": "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
                "description": "Complete renovation of existing shopping center with modern retail spaces and improved accessibility.",
                "client": "Retail Properties LLC"
            },
            {
                "title": "Suburban Housing Development",
                "category": "Residential",
                "location": "Green Valley",
                "completionDate": "April 2024",
                "image": "https://images.pexels.com/photos/323772/pexels-photo-323772.jpeg",
                "description": "50-unit housing development with energy-efficient homes and community amenities.",
                "client": "Valley Developers"
            },
            {
                "title": "Bridge Construction",
                "category": "Infrastructure",
                "location": "River Crossing",
                "completionDate": "February 2024",
                "image": "https://images.pexels.com/photos/3862618/pexels-photo-3862618.jpeg",
                "description": "New bridge construction connecting two major districts with modern engineering solutions.",
                "client": "City Transportation Dept"
            },
            {
                "title": "Hospital Extension",
                "category": "Commercial",
                "location": "Medical District",
                "completionDate": "January 2024",
                "image": "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg",
                "description": "Modern hospital wing with advanced medical facilities and patient-centered design.",
                "client": "Central Medical Center"
            },
            {
                "title": "Warehouse Complex",
                "category": "Industrial",
                "location": "Logistics Hub",
                "completionDate": "November 2023",
                "image": "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg",
                "description": "Multi-building warehouse complex with automated systems and loading facilities.",
                "client": "LogiCorp Solutions"
            }
        ]

        for p_data in projects_data:
            project = Project(
                title=p_data['title'],
                category=p_data['category'],
                location=p_data['location'],
                completion_date=p_data['completionDate'],
                image=p_data['image'],
                description=p_data['description'],
                client=p_data['client']
            )
            db.session.add(project)
        db.session.commit()

        # Seed Blog Posts
        blog_posts_data = [
            {
                "title": "5 Essential Tips for Planning Your Home Renovation",
                "excerpt": "Planning a home renovation can be overwhelming. Here are five essential tips to help you navigate the process successfully and avoid common pitfalls.",
                "content": "Full article content for 5 Essential Tips for Planning Your Home Renovation.",
                "author": "Sarah Thompson",
                "publishDate": "January 15, 2025",
                "category": "Renovation",
                "image": "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg",
                "readTime": "5 min read"
            },
            {
                "title": "The Future of Sustainable Construction",
                "excerpt": "Explore the latest trends in sustainable construction and how green building practices are shaping the industry's future.",
                "content": "Full article content for The Future of Sustainable Construction.",
                "author": "Michael Rodriguez",
                "publishDate": "January 10, 2025",
                "category": "Sustainability",
                "image": "https://images.pexels.com/photos/3862618/pexels-photo-3862618.jpeg",
                "readTime": "7 min read"
            },
            {
                "title": "Modern Office Spaces: Design Trends for 2025",
                "excerpt": "Discover the latest design trends shaping modern office spaces and how they impact productivity and employee satisfaction.",
                "content": "Full article content for Modern Office Spaces: Design Trends for 2025.",
                "author": "Emily Chen",
                "publishDate": "January 5, 2025",
                "category": "Design",
                "image": "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
                "readTime": "6 min read"
            },
            {
                "title": "Construction Safety: Best Practices and Innovations",
                "excerpt": "Learn about the latest safety innovations and best practices that are making construction sites safer for workers.",
                "content": "Full article content for Construction Safety: Best Practices and Innovations.",
                "author": "David Williams",
                "publishDate": "December 28, 2024",
                "category": "Safety",
                "image": "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg",
                "readTime": "8 min read"
            },
            {
                "title": "Smart Building Technology Integration",
                "excerpt": "How smart building technologies are revolutionizing the construction industry and improving building efficiency.",
                "content": "Full article content for Smart Building Technology Integration.",
                "author": "John Mitchell",
                "publishDate": "December 20, 2024",
                "category": "Technology",
                "image": "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg",
                "readTime": "9 min read"
            },
            {
                "title": "Project Management Best Practices",
                "excerpt": "Essential project management techniques that ensure construction projects are completed on time and within budget.",
                "content": "Full article content for Project Management Best Practices.",
                "author": "Lisa Anderson",
                "publishDate": "December 15, 2024",
                "category": "Management",
                "image": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
                "readTime": "6 min read"
            }
        ]

        for bp_data in blog_posts_data:
            blog_post = BlogPost(
                title=bp_data['title'],
                excerpt=bp_data['excerpt'],
                content=bp_data['content'],
                author=bp_data['author'],
                publish_date=bp_data['publishDate'],
                category=bp_data['category'],
                image=bp_data['image'],
                read_time=bp_data['readTime']
            )
            db.session.add(blog_post)
        db.session.commit()

        # Seed Team Members
        team_members_data = [
            {
                "name": "John Mitchell",
                "position": "CEO & Founder",
                "experience": "25+ years",
                "image": "https://images.pexels.com/photos/3759124/pexels-photo-3759124.jpeg",
                "bio": "Visionary leader with extensive experience in construction management and business development."
            },
            {
                "name": "Sarah Thompson",
                "position": "Chief Project Manager",
                "experience": "18+ years",
                "image": "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg",
                "bio": "Expert in large-scale project coordination and quality assurance across all construction phases."
            },
            {
                "name": "Michael Rodriguez",
                "position": "Head of Engineering",
                "experience": "22+ years",
                "image": "https://images.pexels.com/photos/3760809/pexels-photo-3760809.jpeg",
                "bio": "Licensed civil engineer specializing in structural design and infrastructure development."
            },
            {
                "name": "Emily Chen",
                "position": "Design Director",
                "experience": "15+ years",
                "image": "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg",
                "bio": "Creative professional combining architectural expertise with sustainable design principles."
            },
            {
                "name": "David Williams",
                "position": "Safety Coordinator",
                "experience": "20+ years",
                "image": "https://images.pexels.com/photos/3759124/pexels-photo-3759124.jpeg",
                "bio": "Dedicated to maintaining the highest safety standards on all construction sites."
            },
            {
                "name": "Lisa Anderson",
                "position": "Quality Control Manager",
                "experience": "16+ years",
                "image": "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg",
                "bio": "Ensures every project meets our rigorous quality standards and client expectations."
            }
        ]

        for tm_data in team_members_data:
            team_member = TeamMember(
                name=tm_data['name'],
                position=tm_data['position'],
                experience=tm_data['experience'],
                image=tm_data['image'],
                bio=tm_data['bio']
            )
            db.session.add(team_member)
        db.session.commit()

        # Seed Testimonials
        testimonials_data = [
            {
                "name": "Sarah Johnson",
                "company": "Johnson Enterprises",
                "text": "BuildCorp delivered our office building ahead of schedule and within budget. Their attention to detail and professionalism is unmatched.",
                "image": "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg"
            },
            {
                "name": "Michael Chen",
                "company": "Chen Residential",
                "text": "The renovation of our home exceeded all expectations. The team was professional, clean, and the quality of work is exceptional.",
                "image": "https://images.pexels.com/photos/3760809/pexels-photo-3760809.jpeg"
            },
            {
                "name": "David Rodriguez",
                "company": "City Planning Department",
                "text": "BuildCorp has been our go-to contractor for municipal projects. Their expertise in civil engineering is outstanding.",
                "image": "https://images.pexels.com/photos/3759124/pexels-photo-3759124.jpeg"
            }
        ]

        for t_data in testimonials_data:
            testimonial = Testimonial(
                name=t_data['name'],
                company=t_data['company'],
                text=t_data['text'],
                image=t_data['image']
            )
            db.session.add(testimonial)
        db.session.commit()

        # Seed Company Stats
        stats_data = [
            {"number": "500+", "label": "Projects Completed", "icon_name": "CheckCircle"},
            {"number": "25+", "label": "Years Experience", "icon_name": "Clock"},
            {"number": "150+", "label": "Happy Clients", "icon_name": "Users"},
            {"number": "50+", "label": "Awards Won", "icon_name": "Award"},
        ]

        for cs_data in stats_data:
            stat = CompanyStat(
                number=cs_data['number'],
                label=cs_data['label'],
                icon_name=cs_data['icon_name']
            )
            db.session.add(stat)
        db.session.commit()

        # Seed Certifications
        certifications_data = [
            {"name": "LEED Certified Professionals"},
            {"name": "OSHA Safety Certified"},
            {"name": "Licensed General Contractors"},
            {"name": "Bonded & Insured"},
            {"name": "Green Building Council Members"},
            {"name": "Construction Industry Institute"}
        ]
        for c_data in certifications_data:
            certification = Certification(name=c_data['name'])
            db.session.add(certification)
        db.session.commit()

        # Seed Awards
        awards_data = [
            {"name": "Excellence in Construction Award", "year": "2024"},
            {"name": "Best Commercial Project", "year": "2023"},
            {"name": "Safety Achievement Award", "year": "2023"},
            {"name": "Sustainable Building Award", "year": "2022"},
            {"name": "Innovation in Construction", "year": "2022"}
        ]
        for a_data in awards_data:
            award = Award(name=a_data['name'], year=a_data['year'])
            db.session.add(award)
        db.session.commit()

        print("Database seeded successfully!")

if __name__ == '__main__':
    from app import app
    from extensions import db  # Import db from extensions
    # db.init_app(app) # This line is no longer needed as db is initialized in app.py when imported
    seed_data()
