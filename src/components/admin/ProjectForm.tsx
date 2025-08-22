"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createProject, getAllProjects, updateProject, deleteProject } from "../../services/api"
import AdminModal from "./AdminModal"
import AdminTable from "./AdminTable"

interface Project {
  id: number
  title: string
  category: string
  location: string
  completionDate: string
  image: string
  description: string
  client: string
}

const ProjectForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    completionDate: "",
    image: "",
    description: "",
    client: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    const response = await getAllProjects()
    if (response.success && response.data) {
      setProjects(response.data)
    } else {
      setError(response.error || "Failed to fetch projects.")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    setImageFile(file || null)
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsError(false)

    try {
      const data: any = { ...formData }
      if (imageFile) data.file = imageFile
      const response = await createProject(data)
      if (response.success) {
        setMessage(response.message || "Project created successfully!")
        setFormData({
          title: "",
          category: "",
          location: "",
          completionDate: "",
          image: "",
          description: "",
          client: "",
        })
        setImageFile(null)
        fetchProjects() // Refresh the list
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to create project.")
      }
    } catch (err: any) {
      setIsError(true)
      setMessage(err.message || "An unexpected error occurred.")
    }
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsError(false)

    if (editingProjectId === null) {
      setIsError(true)
      setMessage("No project selected for update.")
      return
    }

    try {
      const data: any = { ...formData }
      if (imageFile) data.file = imageFile
      const response = await updateProject(editingProjectId, data)
      if (response.success) {
        setMessage(response.message || "Project updated successfully!")
        setFormData({
          title: "",
          category: "",
          location: "",
          completionDate: "",
          image: "",
          description: "",
          client: "",
        })
        setEditingProjectId(null) // Exit edit mode
        setImageFile(null)
        fetchProjects() // Refresh the list
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to update project.")
      }
    } catch (err: any) {
      setIsError(true)
      setMessage(err.message || "An unexpected error occurred.")
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProjectId(project.id)
    setFormData({
      title: project.title,
      category: project.category,
      location: project.location,
      completionDate: project.completionDate,
      image: project.image,
      description: project.description,
      client: project.client,
    })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingProjectId(null)
    setFormData({ title: "", category: "", location: "", completionDate: "", image: "", description: "", client: "" })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleDelete = async (projectId: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await deleteProject(projectId)
        if (response.success) {
          setMessage(response.message || "Project deleted successfully!")
          fetchProjects() // Refresh the list
        } else {
          setIsError(true)
          setMessage(response.error || "Failed to delete project.")
        }
      } catch (err: any) {
        setIsError(true)
        setMessage(err.message || "An unexpected error occurred.")
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingProjectId(null)
    setFormData({ title: "", category: "", location: "", completionDate: "", image: "", description: "", client: "" })
    setMessage(null)
    setIsError(false)
    setImageFile(null)
  }

  const categories = ["Commercial", "Residential", "Industrial", "Infrastructure"]

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Project
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${isError ? "bg-red-50 text-red-800 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"} text-sm font-medium`}
        >
          {message}
        </div>
      )}

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProjectId ? "Edit Project" : "Add New Project"}
      >
        <form
          onSubmit={(e) => {
            ;(editingProjectId ? handleUpdateSubmit : handleAddSubmit)(e)
            setModalOpen(false)
          }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="completionDate" className="block text-sm font-semibold text-gray-700 mb-1">
              Completion Date
            </label>
            <input
              type="text"
              id="completionDate"
              name="completionDate"
              value={formData.completionDate}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., December 2024"
              required
            />
          </div>
          <div>
            <label htmlFor="imageFile" className="block text-sm font-semibold text-gray-700 mb-1">Upload Image</label>
            <input type="file" id="imageFile" name="imageFile" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full" />
            <p className="text-xs text-gray-500 mt-1">Or provide an image URL below (file upload takes precedence)</p>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1 mt-3">Image URL</label>
            <input type="text" id="image" name="image" value={formData.image} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="client" className="block text-sm font-semibold text-gray-700 mb-1">
              Client
            </label>
            <input
              type="text"
              id="client"
              name="client"
              value={formData.client}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editingProjectId ? "Update Project" : "Add Project"}
            </button>
            {editingProjectId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </AdminModal>

      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center text-gray-600">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading projects...
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-2">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first project to the system.</p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Project
            </button>
          </div>
        ) : (
          <AdminTable
            items={projects}
            columns={[
              { key: "title", label: "Title" },
              {
                key: "category",
                label: "Category",
                render: (item: Project) => (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.category === "Commercial"
                        ? "bg-blue-100 text-blue-800"
                        : item.category === "Residential"
                          ? "bg-green-100 text-green-800"
                          : item.category === "Industrial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {item.category}
                  </span>
                ),
              },
              { key: "location", label: "Location" },
              { key: "completionDate", label: "Completion Date" },
              {
                key: "image",
                label: "Image",
                render: (item: Project) => (
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                  />
                ),
              },
              { key: "client", label: "Client" },
            ]}
            onEdit={(item) => handleEdit(item)}
            onDelete={(id) => handleDelete(id)}
          />
        )}
      </div>
    </div>
  )
}

export default ProjectForm
