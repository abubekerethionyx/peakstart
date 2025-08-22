"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createService, getAllServices, updateService, deleteService } from "../../services/api"
import AdminModal from "./AdminModal"
import AdminTable from "./AdminTable"

interface Service {
  id: number
  title: string
  description: string
  image: string
  icon_name: string
  features: string[]
}

const ServiceForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    icon_name: "",
    features: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    const response = await getAllServices()
    if (response.success && response.data) {
      setServices(response.data)
    } else {
      setError(response.error || "Failed to fetch services.")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const serviceData: any = {
      ...formData,
      features: formData.features.split(",").map((f) => f.trim()).filter((f) => f !== ""),
    }
    if (imageFile) serviceData.file = imageFile

    try {
      const response = await createService(serviceData)
      if (response.success) {
        setMessage(response.message || "Service created successfully!")
        setFormData({ title: "", description: "", image: "", icon_name: "", features: "" })
        setImageFile(null)
        fetchServices()
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to create service.")
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

    if (editingServiceId === null) {
      setIsError(true)
      setMessage("No service selected for update.")
      return
    }

    const serviceData: any = {
      ...formData,
      features: formData.features.split(",").map((f) => f.trim()).filter((f) => f !== ""),
    }
    if (imageFile) serviceData.file = imageFile

    try {
      const response = await updateService(editingServiceId, serviceData)
      if (response.success) {
        setMessage(response.message || "Service updated successfully!")
        setFormData({ title: "", description: "", image: "", icon_name: "", features: "" })
        setEditingServiceId(null)
        setImageFile(null)
        fetchServices()
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to update service.")
      }
    } catch (err: any) {
      setIsError(true)
      setMessage(err.message || "An unexpected error occurred.")
    }
  }

  const handleEdit = (service: Service) => {
    setEditingServiceId(service.id)
    setFormData({
      title: service.title,
      description: service.description,
      image: service.image,
      icon_name: service.icon_name,
      features: service.features.join(", "),
    })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingServiceId(null)
    setFormData({ title: "", description: "", image: "", icon_name: "", features: "" })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleDelete = async (serviceId: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await deleteService(serviceId)
        if (response.success) {
          setMessage(response.message || "Service deleted successfully!")
          fetchServices()
        } else {
          setIsError(true)
          setMessage(response.error || "Failed to delete service.")
        }
      } catch (err: any) {
        setIsError(true)
        setMessage(err.message || "An unexpected error occurred.")
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingServiceId(null)
    setFormData({ title: "", description: "", image: "", icon_name: "", features: "" })
    setMessage(null)
    setIsError(false)
    setImageFile(null)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            isError ? "bg-red-50 text-red-800 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"
          } text-sm font-medium`}
        >
          {message}
        </div>
      )}

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingServiceId ? "Edit Service" : "Add New Service"}
      >
        <form
          onSubmit={(e) => {
            ;(editingServiceId ? handleUpdateSubmit : handleAddSubmit)(e)
            setModalOpen(false)
          }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label htmlFor="imageFile" className="block text-sm font-semibold text-gray-700 mb-1">Upload Image</label>
            <input type="file" id="imageFile" name="imageFile" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full" />
            <p className="text-xs text-gray-500 mt-1">Or provide an image URL below (file upload takes precedence)</p>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1 mt-3">Image URL</label>
            <input type="text" id="image" name="image" value={formData.image} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="icon_name" className="block text-sm font-semibold text-gray-700 mb-1">Icon Name</label>
            <input type="text" id="icon_name" name="icon_name" value={formData.icon_name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="features" className="block text-sm font-semibold text-gray-700 mb-1">Features (comma-separated)</label>
            <textarea id="features" name="features" value={formData.features} onChange={handleInputChange} rows={2} placeholder="Feature 1, Feature 2" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div className="flex justify-center space-x-4">
            <button type="submit" className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              {editingServiceId ? "Update Service" : "Add Service"}
            </button>
            {editingServiceId && (
              <button type="button" onClick={handleCancelEdit} className="px-6 py-3 border rounded-md bg-white text-gray-700 hover:bg-gray-50">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </AdminModal>

      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">Loading services...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">Error: {error}</div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first service.</p>
            <button onClick={handleOpenAdd} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Add Your First Service</button>
          </div>
        ) : (
          <AdminTable
            items={services}
            columns={[
              { key: "title", label: "Title" },
              { key: "description", label: "Description", render: (item: Service) => (item.description.length > 70 ? item.description.substring(0, 70) + "..." : item.description) },
              { key: "image", label: "Image", render: (item: Service) => <img src={item.image} alt={item.title} className="h-12 w-12 object-cover rounded-md" /> },
              { key: "icon_name", label: "Icon" },
              { key: "features", label: "Features", render: (item: Service) => item.features.join(", ").substring(0, 50) + (item.features.join(", ").length > 50 ? "..." : "") },
            ]}
            onEdit={(item) => handleEdit(item)}
            onDelete={(id) => handleDelete(id)}
          />
        )}
      </div>
    </div>
  )
}

export default ServiceForm
