interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon_name: string;
  features: string[];
}

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  completionDate: string;
  image: string;
  description: string;
  client: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  image: string;
  readTime: string;
}

interface TeamMember {
  id: number;
  name: string;
  position: string;
  experience: string;
  image: string;
  bio: string;
}

interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  image: string;
}

interface CompanyStat {
  id: number;
  number: string;
  label: string;
  icon_name: string;
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

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  projectType?: string;
  message: string;
  budget?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const API_BASE_URL = 'http://localhost:5000';

// Home Page APIs
export const getHomeStats = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/home/stats`);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching home stats:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getHomeTestimonials = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/home/testimonials`);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching home testimonials:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getHomeServices = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/home/services`);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching home services:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

// Services Page APIs
export const getAllServices = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services`);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching all services:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getServiceById = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`);
    return response.json();
  } catch (error: any) {
    console.error(`Error fetching service with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createService = async (serviceData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services`, {
    method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    body: JSON.stringify(serviceData),
  });
    return response.json();
  } catch (error: any) {
    console.error("Error creating service:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const updateService = async (id: number, serviceData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    body: JSON.stringify(serviceData),
  });
    return response.json();
  } catch (error: any) {
    console.error(`Error updating service with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteService = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting service with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

// Projects/Portfolio APIs
export const getAllProjects = async (category?: string): Promise<ApiResponse<any[]>> => {
  try {
    const url = category && category !== 'All' ? `${API_BASE_URL}/api/projects?category=${category}` : `${API_BASE_URL}/api/projects`;
    const response = await fetch(url);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getProjectById = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
    return response.json();
  } catch (error: any) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createProject = async (projectData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    body: JSON.stringify(projectData),
  });
    return response.json();
  } catch (error: any) {
    console.error("Error creating project:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const updateProject = async (id: number, projectData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error updating project with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteProject = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting project with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

// Blog APIs
export const getBlogPosts = async (category?: string, searchTerm?: string): Promise<ApiResponse<any[]>> => {
  try {
    let url = `${API_BASE_URL}/api/blog/posts`;
  const params = new URLSearchParams();
  if (category && category !== 'All') {
    params.append('category', category);
  }
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const response = await fetch(url);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getBlogPostById = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/posts/${id}`);
    return response.json();
  } catch (error: any) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getBlogCategories = async (): Promise<ApiResponse<string[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/categories`);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching blog categories:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createBlogPost = async (blogPostData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogPostData),
    });
    return response.json();
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const updateBlogPost = async (id: number, blogPostData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogPostData),
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error updating blog post with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteBlogPost = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/posts/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

// About Page APIs
export const getTeamMembers = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/about/team`);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching team members:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createTeamMember = async (teamMemberData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/about/team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamMemberData),
    });
    return response.json();
  } catch (error: any) {
    console.error("Error creating team member:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const updateTeamMember = async (id: number, teamMemberData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/about/team/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamMemberData),
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error updating team member with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteTeamMember = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/about/team/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting team member with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getCertifications = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/about/certifications`);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching certifications:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createCertification = async (certificationData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/about/certifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(certificationData),
    });
    return response.json();
  } catch (error: any) {
    console.error("Error creating certification:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const updateCertification = async (id: number, certificationData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/about/certifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(certificationData),
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error updating certification with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteCertification = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/about/certifications/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting certification with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getAwards = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/about/awards`);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching awards:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createAward = async (awardData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/about/awards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(awardData),
    });
    return response.json();
  } catch (error: any) {
    console.error("Error creating award:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const updateAward = async (id: number, awardData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/about/awards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(awardData),
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error updating award with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteAward = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/about/awards/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting award with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createCompanyStat = async (companyStatData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/home/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyStatData),
    });
    return response.json();
  } catch (error: any) {
    console.error("Error creating company stat:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const updateCompanyStat = async (id: number, companyStatData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/home/stats/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyStatData),
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error updating company stat with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteCompanyStat = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/home/stats/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting company stat with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createTestimonial = async (testimonialData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testimonialData),
    });
    return response.json();
  } catch (error: any) {
    console.error("Error creating testimonial:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const updateTestimonial = async (id: number, testimonialData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/testimonials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testimonialData),
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error updating testimonial with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteTestimonial = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/testimonials/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting testimonial with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

// Contact Page APIs
export const submitContactForm = async (formData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact/submit`, {
    method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return response.json();
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getContactSubmissions = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact/submissions`);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching contact submissions:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteContactSubmission = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact/submissions/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting contact submission with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

// Construction Management APIs
// Sites APIs
export const getSites = async (status?: string, startDate?: string, endDate?: string): Promise<ApiResponse<any[]>> => {
  try {
    let url = `${API_BASE_URL}/api/sites`;
    const params = new URLSearchParams();
    if (status && status !== 'All') {
      params.append('status', status);
    }
    if (startDate) {
      params.append('start_date', startDate);
    }
    if (endDate) {
      params.append('end_date', endDate);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const response = await fetch(url);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching sites:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getSiteById = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/${id}`);
    return response.json();
  } catch (error: any) {
    console.error(`Error fetching site with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createSite = async (siteData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });
    return response.json();
  } catch (error: any) {
    console.error("Error creating site:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const updateSite = async (id: number, siteData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error updating site with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteSite = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting site with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

// Workers APIs
export const getWorkers = async (siteId?: number, isActive?: boolean): Promise<ApiResponse<any[]>> => {
  try {
    let url = `${API_BASE_URL}/api/workers`;
    const params = new URLSearchParams();
    if (siteId) {
      params.append('site_id', siteId.toString());
    }
    if (isActive !== undefined) {
      params.append('is_active', isActive.toString());
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const response = await fetch(url);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching workers:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getWorkerById = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workers/${id}`);
    return response.json();
  } catch (error: any) {
    console.error(`Error fetching worker with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createWorker = async (workerData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workerData),
    });
    return response.json();
  } catch (error: any) {
    console.error("Error creating worker:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const updateWorker = async (id: number, workerData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workerData),
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error updating worker with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteWorker = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workers/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting worker with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

// Daily Activities APIs
export const getDailyActivities = async (siteId?: number, startDate?: string, endDate?: string, date?: string): Promise<ApiResponse<any[]>> => {
  try {
    let url = `${API_BASE_URL}/api/daily-activities`;
    const params = new URLSearchParams();
    if (siteId) {
      params.append('site_id', siteId.toString());
    }
    if (startDate) {
      params.append('start_date', startDate);
    }
    if (endDate) {
      params.append('end_date', endDate);
    }
    if (date) {
      params.append('date', date);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const response = await fetch(url);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching daily activities:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getDailyActivityById = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/daily-activities/${id}`);
    return response.json();
  } catch (error: any) {
    console.error(`Error fetching daily activity with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createDailyActivity = async (activityData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/daily-activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });
    return response.json();
  } catch (error: any) {
    console.error("Error creating daily activity:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const updateDailyActivity = async (id: number, activityData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/daily-activities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error updating daily activity with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteDailyActivity = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/daily-activities/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting daily activity with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

// Costs APIs
export const getCosts = async (siteId?: number, workerId?: number, costType?: string, category?: string, startDate?: string, endDate?: string, date?: string): Promise<ApiResponse<any[]>> => {
  try {
    let url = `${API_BASE_URL}/api/costs`;
    const params = new URLSearchParams();
    if (siteId) {
      params.append('site_id', siteId.toString());
    }
    if (workerId) {
      params.append('worker_id', workerId.toString());
    }
    if (costType) {
      params.append('cost_type', costType);
    }
    if (category) {
      params.append('category', category);
    }
    if (startDate) {
      params.append('start_date', startDate);
    }
    if (endDate) {
      params.append('end_date', endDate);
    }
    if (date) {
      params.append('date', date);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const response = await fetch(url);
    return response.json();
  } catch (error: any) {
    console.error("Error fetching costs:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getCostById = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/costs/${id}`);
    return response.json();
  } catch (error: any) {
    console.error(`Error fetching cost with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const createCost = async (costData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/costs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(costData),
    });
    return response.json();
  } catch (error: any) {
    console.error("Error creating cost:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const updateCost = async (id: number, costData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/costs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(costData),
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error updating cost with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const deleteCost = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/costs/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    console.error(`Error deleting cost with ID ${id}:`, error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

// Generic API client for axios-like usage
export const api = {
  get: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}/api${url}`);
    return { data: await response.json() };
  },
  post: async (url: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/api${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return { data: await response.json() };
  },
  put: async (url: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/api${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return { data: await response.json() };
  },
  delete: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
    });
    return { data: await response.json() };
  }
};