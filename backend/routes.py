from flask import request, jsonify
from extensions import db
from models import Service, ServiceFeature, Project, BlogPost, TeamMember, Testimonial, ContactSubmission, CompanyStat, Certification, Award


def register_routes(app):
    # Home Page Routes
    @app.route('/api/home/stats', methods=['GET'])
    def get_home_stats():
        """Get company statistics for home page"""
        try:
            stats = CompanyStat.query.all()
            return jsonify({
                'success': True,
                'data': [stat.to_dict() for stat in stats]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/home/testimonials', methods=['GET'])
    def get_home_testimonials():
        """Get testimonials for home page"""
        try:
            testimonials = Testimonial.query.all()
            return jsonify({
                'success': True,
                'data': [testimonial.to_dict() for testimonial in testimonials]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/home/services', methods=['GET'])
    def get_home_services():
        """Get featured services for home page"""
        try:
            services = Service.query.limit(3).all()
            return jsonify({
                'success': True,
                'data': [service.to_dict() for service in services]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    # Services Page Routes
    @app.route('/api/services', methods=['GET'])
    def get_all_services():
        """Get all services with features"""
        try:
            services = Service.query.all()
            return jsonify({
                'success': True,
                'data': [service.to_dict() for service in services]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/services/<int:service_id>', methods=['GET'])
    def get_service(service_id):
        """Get a specific service by ID"""
        try:
            service = Service.query.get_or_404(service_id)
            return jsonify({
                'success': True,
                'data': service.to_dict()
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/services', methods=['POST'])
    def create_service():
        """Create a new service"""
        try:
            data = request.get_json()

            # Create service
            service = Service(
                title=data['title'],
                description=data['description'],
                image=data['image'],
                icon_name=data.get('icon_name')
            )

            db.session.add(service)
            db.session.flush()  # Get the service ID

            # Add features
            if 'features' in data:
                for feature_text in data['features']:
                    feature = ServiceFeature(
                        service_id=service.id,
                        feature=feature_text
                    )
                    db.session.add(feature)

            db.session.commit()

            return jsonify(
                {
                    'success': True,
                    'data': service.to_dict(),
                    'message': 'Service created successfully'
                }
            ), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/services/<int:service_id>', methods=['PUT'])
    def update_service(service_id):
        """Update an existing service"""
        try:
            service = Service.query.get_or_404(service_id)
            data = request.get_json()

            service.title = data.get('title', service.title)
            service.description = data.get('description', service.description)
            service.image = data.get('image', service.image)
            service.icon_name = data.get('icon_name', service.icon_name)

            # Update features
            if 'features' in data:
                # Delete existing features
                ServiceFeature.query.filter_by(service_id=service.id).delete()
                # Add new features
                for feature_text in data['features']:
                    feature = ServiceFeature(service_id=service.id, feature=feature_text)
                    db.session.add(feature)

            db.session.commit()

            return jsonify({'success': True, 'data': service.to_dict(), 'message': 'Service updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/services/<int:service_id>', methods=['DELETE'])
    def delete_service(service_id):
        """Delete a service"""
        try:
            service = Service.query.get_or_404(service_id)
            db.session.delete(service)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Service deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    # Portfolio/Projects Routes
    @app.route('/api/projects', methods=['GET'])
    def get_all_projects():
        """Get all projects with optional category filter"""
        try:
            category = request.args.get('category')
            if category and category != 'All':
                projects = Project.query.filter_by(category=category).all()
            else:
                projects = Project.query.all()

            return jsonify(
                {
                    'success': True,
                    'data': [project.to_dict() for project in projects]
                }
            ), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/projects/<int:project_id>', methods=['GET'])
    def get_project(project_id):
        """Get a specific project by ID"""
        try:
            project = Project.query.get_or_404(project_id)
            return jsonify({'success': True, 'data': project.to_dict()}), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/projects', methods=['POST'])
    def create_project():
        """Create a new project"""
        try:
            data = request.get_json()

            project = Project(
                title=data['title'],
                category=data['category'],
                location=data['location'],
                completion_date=data.get('completionDate') or data.get('completion_date'),
                image=data['image'],
                description=data['description'],
                client=data['client']
            )

            db.session.add(project)
            db.session.commit()

            return jsonify({
                'success': True,
                'data': project.to_dict(),
                'message': 'Project created successfully'
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/projects/<int:project_id>', methods=['PUT'])
    def update_project(project_id):
        """Update an existing project"""
        try:
            project = Project.query.get_or_404(project_id)
            data = request.get_json()

            project.title = data.get('title', project.title)
            project.category = data.get('category', project.category)
            project.location = data.get('location', project.location)
            project.completion_date = data.get('completionDate', project.completion_date)
            project.image = data.get('image', project.image)
            project.description = data.get('description', project.description)
            project.client = data.get('client', project.client)

            db.session.commit()

            return jsonify({'success': True, 'data': project.to_dict(), 'message': 'Project updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/projects/<int:project_id>', methods=['DELETE'])
    def delete_project(project_id):
        """Delete a project"""
        try:
            project = Project.query.get_or_404(project_id)
            db.session.delete(project)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Project deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    # Blog Routes
    @app.route('/api/blog/posts', methods=['GET'])
    def get_blog_posts():
        """Get all blog posts with optional category and search filters"""
        try:
            category = request.args.get('category')
            search = request.args.get('search')

            query = BlogPost.query

            if category and category != 'All':
                query = query.filter_by(category=category)

            if search:
                query = query.filter(
                    db.or_(
                        BlogPost.title.ilike(f'%{search}%'),
                        BlogPost.excerpt.ilike(f'%{search}%')
                    )
                )

            posts = query.order_by(BlogPost.created_at.desc()).all()

            return jsonify({
                'success': True,
                'data': [post.to_dict() for post in posts]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/blog/posts/<int:post_id>', methods=['GET'])
    def get_blog_post(post_id):
        """Get a specific blog post by ID"""
        try:
            post = BlogPost.query.get_or_404(post_id)
            return jsonify({
                'success': True,
                'data': post.to_dict()
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/blog/categories', methods=['GET'])
    def get_blog_categories():
        """Get all blog categories"""
        try:
            categories = db.session.query(BlogPost.category).distinct().all()
            category_list = [cat[0] for cat in categories]
            return jsonify({
                'success': True,
                'data': category_list
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/blog/posts', methods=['POST'])
    def create_blog_post():
        """Create a new blog post"""
        try:
            data = request.get_json()

            blog_post = BlogPost(
                title=data['title'],
                excerpt=data['excerpt'],
                content=data['content'],
                author=data['author'],
                publish_date=data['publishDate'],
                category=data['category'],
                image=data['image'],
                read_time=data['readTime']
            )

            db.session.add(blog_post)
            db.session.commit()

            return jsonify(
                {
                    'success': True,
                    'data': blog_post.to_dict(),
                    'message': 'Blog post created successfully'
                }
            ), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/blog/posts/<int:post_id>', methods=['PUT'])
    def update_blog_post(post_id):
        """Update an existing blog post"""
        try:
            blog_post = BlogPost.query.get_or_404(post_id)
            data = request.get_json()

            blog_post.title = data.get('title', blog_post.title)
            blog_post.excerpt = data.get('excerpt', blog_post.excerpt)
            blog_post.content = data.get('content', blog_post.content)
            blog_post.author = data.get('author', blog_post.author)
            blog_post.publish_date = data.get('publishDate', blog_post.publish_date)
            blog_post.category = data.get('category', blog_post.category)
            blog_post.image = data.get('image', blog_post.image)
            blog_post.read_time = data.get('readTime', blog_post.read_time)

            db.session.commit()

            return jsonify({'success': True, 'data': blog_post.to_dict(), 'message': 'Blog post updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/blog/posts/<int:post_id>', methods=['DELETE'])
    def delete_blog_post(post_id):
        """Delete a blog post"""
        try:
            blog_post = BlogPost.query.get_or_404(post_id)
            db.session.delete(blog_post)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Blog post deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    # About Page Routes
    @app.route('/api/about/team', methods=['GET'])
    def get_team_members():
        """Get all team members"""
        try:
            team = TeamMember.query.all()
            return jsonify({
                'success': True,
                'data': [member.to_dict() for member in team]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/about/team', methods=['POST'])
    def create_team_member():
        """Create a new team member"""
        try:
            data = request.get_json()

            team_member = TeamMember(
                name=data['name'],
                position=data['position'],
                experience=data['experience'],
                image=data['image'],
                bio=data['bio']
            )

            db.session.add(team_member)
            db.session.commit()

            return jsonify(
                {
                    'success': True,
                    'data': team_member.to_dict(),
                    'message': 'Team member created successfully'
                }
            ), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/about/team/<int:member_id>', methods=['PUT'])
    def update_team_member(member_id):
        """Update an existing team member"""
        try:
            team_member = TeamMember.query.get_or_404(member_id)
            data = request.get_json()

            team_member.name = data.get('name', team_member.name)
            team_member.position = data.get('position', team_member.position)
            team_member.experience = data.get('experience', team_member.experience)
            team_member.image = data.get('image', team_member.image)
            team_member.bio = data.get('bio', team_member.bio)

            db.session.commit()

            return jsonify({'success': True, 'data': team_member.to_dict(), 'message': 'Team member updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/about/team/<int:member_id>', methods=['DELETE'])
    def delete_team_member(member_id):
        """Delete a team member"""
        try:
            team_member = TeamMember.query.get_or_404(member_id)
            db.session.delete(team_member)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Team member deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/about/certifications', methods=['GET'])
    def get_certifications():
        """Get all company certifications"""
        try:
            certifications = Certification.query.all()
            return jsonify({
                'success': True,
                'data': [cert.to_dict() for cert in certifications]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/about/certifications', methods=['POST'])
    def create_certification():
        """Create a new certification"""
        try:
            data = request.get_json()

            certification = Certification(
                name=data['name']
            )

            db.session.add(certification)
            db.session.commit()

            return jsonify(
                {
                    'success': True,
                    'data': certification.to_dict(),
                    'message': 'Certification created successfully'
                }
            ), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/about/certifications/<int:certification_id>', methods=['PUT'])
    def update_certification(certification_id):
        """Update an existing certification"""
        try:
            certification = Certification.query.get_or_404(certification_id)
            data = request.get_json()

            certification.name = data.get('name', certification.name)

            db.session.commit()

            return jsonify({'success': True, 'data': certification.to_dict(), 'message': 'Certification updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/about/certifications/<int:certification_id>', methods=['DELETE'])
    def delete_certification(certification_id):
        """Delete a certification"""
        try:
            certification = Certification.query.get_or_404(certification_id)
            db.session.delete(certification)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Certification deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/about/awards', methods=['GET'])
    def get_awards():
        """Get all company awards"""
        try:
            awards = Award.query.all()
            return jsonify({
                'success': True,
                'data': [award.to_dict() for award in awards]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/about/awards', methods=['POST'])
    def create_award():
        """Create a new award"""
        try:
            data = request.get_json()

            award = Award(
                name=data['name'],
                year=data['year']
            )

            db.session.add(award)
            db.session.commit()

            return jsonify(
                {
                    'success': True,
                    'data': award.to_dict(),
                    'message': 'Award created successfully'
                }
            ), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/about/awards/<int:award_id>', methods=['PUT'])
    def update_award(award_id):
        """Update an existing award"""
        try:
            award = Award.query.get_or_404(award_id)
            data = request.get_json()

            award.name = data.get('name', award.name)
            award.year = data.get('year', award.year)

            db.session.commit()

            return jsonify({'success': True, 'data': award.to_dict(), 'message': 'Award updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500



    @app.route('/api/about/awards/<int:award_id>', methods=['DELETE'])
    def delete_award(award_id):
        """Delete a award"""
        try:
            award = Award.query.get_or_404(award_id)
            db.session.delete(award)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Award deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/home/stats', methods=['POST'])
    def create_company_stat():
        """Create a new company stat"""
        try:
            data = request.get_json()

            company_stat = CompanyStat(
                number=data['number'],
                label=data['label'],
                icon_name=data['icon_name']
            )

            db.session.add(company_stat)
            db.session.commit()

            return jsonify(
                {
                    'success': True,
                    'data': company_stat.to_dict(),
                    'message': 'Company stat created successfully'
                }
            ), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/home/stats/<int:stat_id>', methods=['PUT'])
    def update_company_stat(stat_id):
        """Update an existing company stat"""
        try:
            company_stat = CompanyStat.query.get_or_404(stat_id)
            data = request.get_json()

            company_stat.number = data.get('number', company_stat.number)
            company_stat.label = data.get('label', company_stat.label)
            company_stat.icon_name = data.get('icon_name', company_stat.icon_name)

            db.session.commit()

            return jsonify({'success': True, 'data': company_stat.to_dict(), 'message': 'Company stat updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500


    @app.route('/api/home/stats/<int:stat_id>', methods=['DELETE'])
    def delete_company_stat(stat_id):
        """Delete a company stat"""
        try:
            company_stat = CompanyStat.query.get_or_404(stat_id)
            db.session.delete(company_stat)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Company stat deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/testimonials', methods=['POST'])
    def create_testimonial():
        """Create a new testimonial"""
        try:
            data = request.get_json()

            testimonial = Testimonial(
                name=data['name'],
                company=data['company'],
                text=data['text'],
                image=data['image']
            )

            db.session.add(testimonial)
            db.session.commit()

            return jsonify(
                {
                    'success': True,
                    'data': testimonial.to_dict(),
                    'message': 'Testimonial created successfully'
                }
            ), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/testimonials/<int:testimonial_id>', methods=['PUT'])
    def update_testimonial(testimonial_id):
        """Update an existing testimonial"""
        try:
            testimonial = Testimonial.query.get_or_404(testimonial_id)
            data = request.get_json()

            testimonial.name = data.get('name', testimonial.name)
            testimonial.company = data.get('company', testimonial.company)
            testimonial.text = data.get('text', testimonial.text)
            testimonial.image = data.get('image', testimonial.image)

            db.session.commit()

            return jsonify({'success': True, 'data': testimonial.to_dict(), 'message': 'Testimonial updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/testimonials/<int:testimonial_id>', methods=['DELETE'])
    def delete_testimonial(testimonial_id):
        """Delete a testimonial"""
        try:
            testimonial = Testimonial.query.get_or_404(testimonial_id)
            db.session.delete(testimonial)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Testimonial deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    # Contact Routes
    @app.route('/api/contact/submit', methods=['POST'])
    def submit_contact_form():
        """Submit a contact form"""
        try:
            data = request.get_json()

            submission = ContactSubmission(
                first_name=data['firstName'],
                last_name=data['lastName'],
                email=data['email'],
                phone=data.get('phone'),
                project_type=data.get('projectType'),
                message=data['message'],
                budget=data.get('budget')
            )

            db.session.add(submission)
            db.session.commit()

            return jsonify({
                'success': True,
                'message': 'Contact form submitted successfully'
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/contact/submissions', methods=['GET'])
    def get_contact_submissions():
        """Get all contact submissions (admin only)"""
        try:
            submissions = ContactSubmission.query.order_by(ContactSubmission.created_at.desc()).all()
            return jsonify({
                'success': True,
                'data': [submission.to_dict() for submission in submissions]
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/contact/submissions/<int:submission_id>', methods=['DELETE'])
    def delete_contact_submission(submission_id):
        """Delete a contact submission"""
        try:
            submission = ContactSubmission.query.get_or_404(submission_id)
            db.session.delete(submission)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Contact submission deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500

    # Admin Routes for Data Management
    @app.route('/api/admin/upload-fake-data', methods=['POST'])
    def upload_fake_data():
        """Upload fake data to populate the database"""
        try:
            # This would be called to populate the database with sample data
            # Implementation in data_seeder.py
            return jsonify({
                'success': True,
                'message': 'Fake data uploaded successfully'
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'success': False, 'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'success': False, 'error': 'Internal server error'}), 500
