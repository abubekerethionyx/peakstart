"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createTestimonial, getHomeTestimonials, updateTestimonial, deleteTestimonial } from "../../services/api"
import AdminModal from "./AdminModal"
import AdminTable from "./AdminTable"

interface Testimonial {
  id: number
  name: string
  company: string
  text: string
  image: string
}

const TestimonialForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    text: "",
    image: "",
  })
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchTestimonials = async () => {
    setLoading(true)
    setError(null)
    const response = await getHomeTestimonials()
    if (response.success && response.data) {
      setTestimonials(response.data)
    } else {
      setError(response.error || "Failed to fetch testimonials.")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsError(false)

    try {
      const response = await createTestimonial(formData)
      if (response.success) {
        setMessage(response.message || "Testimonial created successfully!")
        setFormData({ name: "", company: "", text: "", image: "" })
        fetchTestimonials()
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to create testimonial.")
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

    if (editingTestimonialId === null) {
      setIsError(true)
      setMessage("No testimonial selected for update.")
      return
    }

    try {
      const response = await updateTestimonial(editingTestimonialId, formData)
      if (response.success) {
        setMessage(response.message || "Testimonial updated successfully!")
        setFormData({ name: "", company: "", text: "", image: "" })
        setEditingTestimonialId(null)
        fetchTestimonials()
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to update testimonial.")
      }
    } catch (err: any) {
      setIsError(true)
      setMessage(err.message || "An unexpected error occurred.")
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonialId(testimonial.id)
    setFormData({
      name: testimonial.name,
      company: testimonial.company,
      text: testimonial.text,
      image: testimonial.image,
    })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingTestimonialId(null)
    setFormData({ name: "", company: "", text: "", image: "" })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleDelete = async (testimonialId: number) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        const response = await deleteTestimonial(testimonialId)
        if (response.success) {
          setMessage(response.message || "Testimonial deleted successfully!")
          fetchTestimonials()
        } else {
          setIsError(true)
          setMessage(response.error || "Failed to delete testimonial.")
        }
      } catch (err: any) {
        setIsError(true)
        setMessage(err.message || "An unexpected error occurred.")
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingTestimonialId(null)
    setFormData({ name: "", company: "", text: "", image: "" })
    setMessage(null)
    setIsError(false)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Testimonial Management</h2>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            isError
              ? "bg-red-50 text-red-800 border border-red-200"
              : "bg-green-50 text-green-800 border border-green-200"
          } text-sm font-medium`}
        >
          {message}
        </div>
      )}

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTestimonialId ? "Edit Testimonial" : "Add New Testimonial"}
      >
        <form
          onSubmit={(e) => {
            ;(editingTestimonialId ? handleUpdateSubmit : handleAddSubmit)(e)
            setModalOpen(false)
          }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="text" className="block text-sm font-semibold text-gray-700 mb-1">
              Testimonial Text
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {editingTestimonialId ? "Update Testimonial" : "Add Testimonial"}
            </button>
            {editingTestimonialId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
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
              Loading testimonials...
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 mb-6">No testimonials added yet. Start by adding one!</p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Testimonial
            </button>
          </div>
        ) : (
          <AdminTable
            items={testimonials}
            columns={[
              { key: "name", label: "Client Name" },
              { key: "company", label: "Company" },
              {
                key: "text",
                label: "Text",
                render: (item: Testimonial) => (
                  <span className="max-w-xs block truncate text-gray-700">{item.text}</span>
                ),
              },
              {
                key: "image",
                label: "Image",
                render: (item: Testimonial) => (
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                  />
                ),
              },
            ]}
            onEdit={(item) => handleEdit(item)}
            onDelete={(id) => handleDelete(id)}
          />
        )}
      </div>
    </div>
  )
}

export default TestimonialForm
