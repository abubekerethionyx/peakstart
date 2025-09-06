from app import app
from extensions import db
from models import Service, ServiceFeature, Project, BlogPost, TeamMember, Testimonial, ContactSubmission, CompanyStat, Certification, Award, Site, Worker, Attendance, DailyActivity, Cost
from datetime import datetime, date, time, timedelta
import json
import sys

def seed_data():
    print("🌱 Starting database seeding process...", flush=True)
    with app.app_context():
        print("🗑️  Dropping existing tables...", flush=True)
        db.drop_all()
        print("🏗️  Creating new tables...", flush=True)
        db.create_all()

        # Seed Services
        print("📋 Seeding services...", flush=True)
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
        print("✅ Services seeded successfully!", flush=True)

        # Seed Projects
        print("🏢 Seeding projects...", flush=True)
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
        print("✅ Projects seeded successfully!", flush=True)

        # Seed Blog Posts
        print("📝 Seeding blog posts...", flush=True)
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
        print("✅ Blog posts seeded successfully!", flush=True)

        # Seed Team Members
        print("👥 Seeding team members...", flush=True)
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
        print("✅ Team members seeded successfully!", flush=True)

        # Seed Testimonials
        print("💬 Seeding testimonials...", flush=True)
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
        print("✅ Testimonials seeded successfully!", flush=True)

        # Seed Company Stats
        print("📊 Seeding company stats...", flush=True)
        stats_data = [
            {"number": "500+", "label": "Projects Completed", "icon_name": "CheckCircle"},
            {"number": "5+", "label": "Years Experience", "icon_name": "Clock"},
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
        print("✅ Company stats seeded successfully!", flush=True)

        # Seed Certifications
        print("🏆 Seeding certifications...", flush=True)
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
        print("✅ Certifications seeded successfully!", flush=True)

        # Seed Awards
        print("🎖️  Seeding awards...", flush=True)
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
        print("✅ Awards seeded successfully!", flush=True)

        # Seed Construction Management Data
        print("🏗️  Seeding construction management data...", flush=True)
        # Seed Sites
        print("📍 Seeding construction sites...", flush=True)
        sites_data = [
            {
                "name": "Downtown Office Complex",
                "location": "123 Main Street, Downtown",
                "description": "Modern 15-story office building with sustainable features",
                "start_date": date(2024, 1, 15),
                "end_date": date(2024, 12, 31),
                "status": "active"
            },
            {
                "name": "Hillside Residential Project",
                "location": "456 Hillside Avenue, Suburbs",
                "description": "Luxury residential development with 20 units",
                "start_date": date(2024, 3, 1),
                "end_date": date(2025, 6, 30),
                "status": "active"
            },
            {
                "name": "Industrial Warehouse Complex",
                "location": "789 Industrial Blvd, Industrial Park",
                "description": "Large-scale manufacturing facility with advanced infrastructure",
                "start_date": date(2023, 8, 1),
                "end_date": date(2024, 8, 31),
                "status": "completed"
            },
            {
                "name": "Shopping Center Renovation",
                "location": "321 Commerce Street, City Center",
                "description": "Complete renovation of existing shopping center",
                "start_date": date(2024, 2, 1),
                "end_date": date(2024, 10, 31),
                "status": "active"
            },
            {
                "name": "Bridge Construction Project",
                "location": "River Crossing, Highway 101",
                "description": "New bridge construction connecting two districts",
                "start_date": date(2023, 10, 1),
                "end_date": date(2024, 2, 29),
                "status": "completed"
            }
        ]

        sites = []
        for s_data in sites_data:
            site = Site(
                name=s_data['name'],
                location=s_data['location'],
                description=s_data['description'],
                start_date=s_data['start_date'],
                end_date=s_data['end_date'],
                status=s_data['status']
            )
            db.session.add(site)
            sites.append(site)
        db.session.commit()
        print("✅ Construction sites seeded successfully!", flush=True)

        # Seed Workers
        print("👷 Seeding workers...", flush=True)
        workers_data = [
            # Downtown Office Complex Workers
            {"name": "James Wilson", "position": "Site Supervisor", "daily_price": 250.00, "phone": "+1-555-0101", "email": "james.wilson@email.com", "site_index": 0},
            {"name": "Maria Garcia", "position": "Crane Operator", "daily_price": 180.00, "phone": "+1-555-0102", "email": "maria.garcia@email.com", "site_index": 0},
            {"name": "Robert Johnson", "position": "Concrete Worker", "daily_price": 150.00, "phone": "+1-555-0103", "email": "robert.johnson@email.com", "site_index": 0},
            {"name": "Jennifer Davis", "position": "Electrician", "daily_price": 200.00, "phone": "+1-555-0104", "email": "jennifer.davis@email.com", "site_index": 0},
            {"name": "Michael Brown", "position": "Plumber", "daily_price": 190.00, "phone": "+1-555-0105", "email": "michael.brown@email.com", "site_index": 0},
            
            # Hillside Residential Project Workers
            {"name": "Sarah Miller", "position": "Site Manager", "daily_price": 280.00, "phone": "+1-555-0201", "email": "sarah.miller@email.com", "site_index": 1},
            {"name": "David Anderson", "position": "Carpenter", "daily_price": 160.00, "phone": "+1-555-0202", "email": "david.anderson@email.com", "site_index": 1},
            {"name": "Lisa Taylor", "position": "Painter", "daily_price": 140.00, "phone": "+1-555-0203", "email": "lisa.taylor@email.com", "site_index": 1},
            {"name": "Christopher White", "position": "Mason", "daily_price": 170.00, "phone": "+1-555-0204", "email": "christopher.white@email.com", "site_index": 1},
            {"name": "Amanda Martinez", "position": "HVAC Technician", "daily_price": 210.00, "phone": "+1-555-0205", "email": "amanda.martinez@email.com", "site_index": 1},
            
            # Industrial Warehouse Workers
            {"name": "Daniel Thompson", "position": "Project Engineer", "daily_price": 300.00, "phone": "+1-555-0301", "email": "daniel.thompson@email.com", "site_index": 2},
            {"name": "Jessica Lee", "position": "Heavy Equipment Operator", "daily_price": 185.00, "phone": "+1-555-0302", "email": "jessica.lee@email.com", "site_index": 2},
            {"name": "Kevin Rodriguez", "position": "Welder", "daily_price": 175.00, "phone": "+1-555-0303", "email": "kevin.rodriguez@email.com", "site_index": 2},
            {"name": "Nicole Wilson", "position": "Safety Inspector", "daily_price": 220.00, "phone": "+1-555-0304", "email": "nicole.wilson@email.com", "site_index": 2},
            
            # Shopping Center Workers
            {"name": "Mark Jackson", "position": "Renovation Specialist", "daily_price": 195.00, "phone": "+1-555-0401", "email": "mark.jackson@email.com", "site_index": 3},
            {"name": "Rachel Green", "position": "Interior Designer", "daily_price": 180.00, "phone": "+1-555-0402", "email": "rachel.green@email.com", "site_index": 3},
            {"name": "Steven Adams", "position": "Flooring Installer", "daily_price": 155.00, "phone": "+1-555-0403", "email": "steven.adams@email.com", "site_index": 3},
            
            # Bridge Construction Workers
            {"name": "Laura Clark", "position": "Civil Engineer", "daily_price": 320.00, "phone": "+1-555-0501", "email": "laura.clark@email.com", "site_index": 4},
            {"name": "Thomas Lewis", "position": "Steel Worker", "daily_price": 200.00, "phone": "+1-555-0502", "email": "thomas.lewis@email.com", "site_index": 4},
            {"name": "Michelle Walker", "position": "Concrete Specialist", "daily_price": 165.00, "phone": "+1-555-0503", "email": "michelle.walker@email.com", "site_index": 4}
        ]

        workers = []
        for w_data in workers_data:
            worker = Worker(
                name=w_data['name'],
                position=w_data['position'],
                daily_price=w_data['daily_price'],
                phone=w_data['phone'],
                email=w_data['email'],
                site_id=sites[w_data['site_index']].id,
                is_active=True
            )
            db.session.add(worker)
            workers.append(worker)
        db.session.commit()
        print("✅ Workers seeded successfully!", flush=True)

        # Seed Attendance Records (last 30 days for active sites)
        print("📅 Seeding attendance records...", flush=True)
        current_date = date.today()
        
        attendance_count = 0
        for i, worker in enumerate(workers):
            # Get worker's site
            worker_site = next(site for site in sites if site.id == worker.site_id)
            
            # Only create attendance for active sites
            if worker_site.status == 'active':
                for days_ago in range(30):
                    attendance_date = current_date - timedelta(days=days_ago)
                    
                    # Skip weekends (Saturday=5, Sunday=6)
                    if attendance_date.weekday() < 5:
                        # 90% attendance rate
                        is_present = (hash(f"{worker.id}{attendance_date}") % 10) < 9
                        
                        if is_present:
                            # Random work hours between 7-10 hours
                            hours_worked = 7 + (hash(f"{worker.id}{attendance_date}") % 4)
                            check_in_time = time(7, 0)  # 7:00 AM
                            check_out_time = time(7 + hours_worked, 0)
                            
                            attendance = Attendance(
                                worker_id=worker.id,
                                date=attendance_date,
                                check_in_time=check_in_time,
                                check_out_time=check_out_time,
                                hours_worked=hours_worked,
                                is_present=True,
                                notes="Regular work day" if hours_worked >= 8 else "Partial day"
                            )
                            db.session.add(attendance)
                            attendance_count += 1
                        else:
                            # Absent day
                            attendance = Attendance(
                                worker_id=worker.id,
                                date=attendance_date,
                                is_present=False,
                                notes="Absent"
                            )
                            db.session.add(attendance)
                            attendance_count += 1
        
        db.session.commit()
        print(f"✅ Attendance records seeded successfully! ({attendance_count} records)", flush=True)

        # Seed Daily Activities
        print("🔨 Seeding daily activities...", flush=True)
        activities_data = [
            # Downtown Office Complex Activities
            {"activity_name": "Foundation Pouring", "description": "Concrete foundation work for building base", "quantity": 150.0, "unit_price": 25.00, "site_index": 0, "workers_involved": [0, 1, 2]},
            {"activity_name": "Steel Frame Installation", "description": "Structural steel frame assembly", "quantity": 80.0, "unit_price": 45.00, "site_index": 0, "workers_involved": [0, 1, 2]},
            {"activity_name": "Electrical Rough-in", "description": "Initial electrical wiring installation", "quantity": 200.0, "unit_price": 15.00, "site_index": 0, "workers_involved": [3]},
            {"activity_name": "Plumbing Installation", "description": "Main plumbing system installation", "quantity": 120.0, "unit_price": 20.00, "site_index": 0, "workers_involved": [4]},
            
            # Hillside Residential Activities
            {"activity_name": "Site Preparation", "description": "Land clearing and grading", "quantity": 50.0, "unit_price": 30.00, "site_index": 1, "workers_involved": [5, 6]},
            {"activity_name": "Framing Work", "description": "Wood frame construction", "quantity": 100.0, "unit_price": 35.00, "site_index": 1, "workers_involved": [6, 7]},
            {"activity_name": "Interior Finishing", "description": "Painting and interior work", "quantity": 80.0, "unit_price": 25.00, "site_index": 1, "workers_involved": [7, 8]},
            {"activity_name": "HVAC Installation", "description": "Heating and cooling system setup", "quantity": 20.0, "unit_price": 50.00, "site_index": 1, "workers_involved": [9]},
            
            # Industrial Warehouse Activities
            {"activity_name": "Heavy Machinery Setup", "description": "Installation of manufacturing equipment", "quantity": 15.0, "unit_price": 100.00, "site_index": 2, "workers_involved": [10, 11]},
            {"activity_name": "Steel Structure Welding", "description": "Welding of structural components", "quantity": 60.0, "unit_price": 40.00, "site_index": 2, "workers_involved": [12]},
            {"activity_name": "Safety System Installation", "description": "Fire safety and security systems", "quantity": 25.0, "unit_price": 60.00, "site_index": 2, "workers_involved": [13]},
            
            # Shopping Center Activities
            {"activity_name": "Demolition Work", "description": "Removal of old fixtures and structures", "quantity": 40.0, "unit_price": 20.00, "site_index": 3, "workers_involved": [14]},
            {"activity_name": "Interior Design Implementation", "description": "New interior design installation", "quantity": 30.0, "unit_price": 45.00, "site_index": 3, "workers_involved": [15]},
            {"activity_name": "Flooring Installation", "description": "New flooring throughout the center", "quantity": 200.0, "unit_price": 12.00, "site_index": 3, "workers_involved": [16]},
            
            # Bridge Construction Activities
            {"activity_name": "Pile Driving", "description": "Foundation piles for bridge support", "quantity": 25.0, "unit_price": 80.00, "site_index": 4, "workers_involved": [17, 18]},
            {"activity_name": "Steel Beam Installation", "description": "Main structural steel beams", "quantity": 12.0, "unit_price": 120.00, "site_index": 4, "workers_involved": [18]},
            {"activity_name": "Concrete Deck Pouring", "description": "Bridge deck concrete work", "quantity": 80.0, "unit_price": 35.00, "site_index": 4, "workers_involved": [19]}
        ]

        for a_data in activities_data:
            # Calculate total price
            total_price = a_data['quantity'] * a_data['unit_price']
            
            # Random date within the last 30 days
            days_ago = hash(f"{a_data['activity_name']}{a_data['site_index']}") % 30
            activity_date = current_date - timedelta(days=days_ago)
            
            activity = DailyActivity(
                site_id=sites[a_data['site_index']].id,
                date=activity_date,
                activity_name=a_data['activity_name'],
                description=a_data['description'],
                quantity=a_data['quantity'],
                unit_price=a_data['unit_price'],
                total_price=total_price,
                workers_involved=json.dumps(a_data['workers_involved'])
            )
            db.session.add(activity)
        db.session.commit()
        print("✅ Daily activities seeded successfully!", flush=True)

        # Seed Costs
        print("💰 Seeding costs...", flush=True)
        costs_data = [
            # Worker-related costs (approved attendance)
            {"cost_type": "worker", "description": "Approved work for James Wilson - 20 days", "amount": 5000.00, "category": "labor", "worker_id": 0},
            {"cost_type": "worker", "description": "Approved work for Maria Garcia - 18 days", "amount": 3240.00, "category": "labor", "worker_id": 1},
            {"cost_type": "worker", "description": "Approved work for Robert Johnson - 22 days", "amount": 3300.00, "category": "labor", "worker_id": 2},
            {"cost_type": "worker", "description": "Approved work for Sarah Miller - 19 days", "amount": 5320.00, "category": "labor", "worker_id": 5},
            {"cost_type": "worker", "description": "Approved work for David Anderson - 21 days", "amount": 3360.00, "category": "labor", "worker_id": 6},
            
            # Activity-related costs (approved activities)
            {"cost_type": "activity", "description": "Approved activity: Foundation Pouring", "amount": 3750.00, "category": "labor", "activity_id": 0},
            {"cost_type": "activity", "description": "Approved activity: Steel Frame Installation", "amount": 3600.00, "category": "labor", "activity_id": 1},
            {"cost_type": "activity", "description": "Approved activity: Framing Work", "amount": 3500.00, "category": "labor", "activity_id": 5},
            {"cost_type": "activity", "description": "Approved activity: Steel Structure Welding", "amount": 2400.00, "category": "labor", "activity_id": 9},
            
            # Material costs
            {"cost_type": "material", "description": "Concrete delivery - 50 cubic yards", "amount": 2500.00, "category": "materials"},
            {"cost_type": "material", "description": "Steel beams and structural components", "amount": 15000.00, "category": "materials"},
            {"cost_type": "material", "description": "Electrical wiring and components", "amount": 3500.00, "category": "materials"},
            {"cost_type": "material", "description": "Plumbing pipes and fixtures", "amount": 2800.00, "category": "materials"},
            {"cost_type": "material", "description": "Paint and finishing materials", "amount": 1200.00, "category": "materials"},
            
            # Equipment costs
            {"cost_type": "equipment", "description": "Crane rental - 15 days", "amount": 4500.00, "category": "equipment"},
            {"cost_type": "equipment", "description": "Excavator rental - 10 days", "amount": 2500.00, "category": "equipment"},
            {"cost_type": "equipment", "description": "Concrete mixer rental - 8 days", "amount": 1200.00, "category": "equipment"},
            {"cost_type": "equipment", "description": "Welding equipment rental - 12 days", "amount": 1800.00, "category": "equipment"},
            
            # Other costs
            {"cost_type": "other", "description": "Permit fees and licenses", "amount": 2500.00, "category": "overhead"},
            {"cost_type": "other", "description": "Insurance for construction period", "amount": 3500.00, "category": "overhead"},
            {"cost_type": "other", "description": "Transportation and logistics", "amount": 1800.00, "category": "transportation"},
            {"cost_type": "other", "description": "Utility connections", "amount": 1200.00, "category": "utilities"}
        ]

        for c_data in costs_data:
            # Random date within the last 30 days
            days_ago = hash(f"{c_data['description']}") % 30
            cost_date = current_date - timedelta(days=days_ago)
            
            # Assign to a random active site
            active_sites = [site for site in sites if site.status == 'active']
            site_id = active_sites[hash(c_data['description']) % len(active_sites)].id
            
            cost = Cost(
                site_id=site_id,
                worker_id=c_data.get('worker_id'),
                daily_activity_id=c_data.get('activity_id'),
                cost_type=c_data['cost_type'],
                description=c_data['description'],
                amount=c_data['amount'],
                date=cost_date,
                category=c_data['category']
            )
            db.session.add(cost)
        db.session.commit()
        print("✅ Costs seeded successfully!", flush=True)

        print("🎉 Database seeded successfully with construction management data!", flush=True)
        print("📊 Summary:", flush=True)
        print("   - 5 Construction Sites", flush=True)
        print("   - 20 Workers", flush=True)
        print("   - ~600 Attendance Records", flush=True)
        print("   - 17 Daily Activities", flush=True)
        print("   - 22 Cost Records", flush=True)

if __name__ == '__main__':
    from app import app
    from extensions import db  # Import db from extensions
    # db.init_app(app) # This line is no longer needed as db is initialized in app.py when imported
    seed_data()
