"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createCertification, getCertifications, updateCertification, deleteCertification } from "../../services/api"
import AdminModal from "./AdminModal"
import AdminTable from "./AdminTable"

interface Certification {
  id: number
  name: string
}

const CertificationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
  })
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCertificationId, setEditingCertificationId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchCertifications = async () => {
    setLoading(true)
    setError(null)
    const response = await getCertifications()
    if (response.success && response.data) {
      setCertifications(response.data)
    } else {
      setError(response.error || "Failed to fetch certifications.")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCertifications()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await createCertification(formData)
      if (response.success) {
        setMessage(response.message || "Certification created successfully!")
        setFormData({
          name: "",
        })
        fetchCertifications() // Refresh the list
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to create certification.")
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

    if (editingCertificationId === null) {
      setIsError(true)
      setMessage("No certification selected for update.")
      return
    }

    try {
      const response = await updateCertification(editingCertificationId, formData)
      if (response.success) {
        setMessage(response.message || "Certification updated successfully!")
        setFormData({
          name: "",
        })
        setEditingCertificationId(null) // Exit edit mode
        fetchCertifications() // Refresh the list
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to update certification.")
      }
    } catch (err: any) {
      setIsError(true)
      setMessage(err.message || "An unexpected error occurred.")
    }
  }

  const handleEdit = (certification: Certification) => {
    setEditingCertificationId(certification.id)
    setFormData({
      name: certification.name,
    })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingCertificationId(null)
    setFormData({ name: "" })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleDelete = async (certificationId: number) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      try {
        const response = await deleteCertification(certificationId)
        if (response.success) {
          setMessage(response.message || "Certification deleted successfully!")
          fetchCertifications() // Refresh the list
        } else {
          setIsError(true)
          setMessage(response.error || "Failed to delete certification.")
        }
      } catch (err: any) {
        setIsError(true)
        setMessage(err.message || "An unexpected error occurred.")
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingCertificationId(null)
    setFormData({
      name: "",
    })
    setMessage(null)
    setIsError(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Certifications</h2>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Certification
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${isError ? "bg-red-50 text-red-800 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"} font-medium`}
        >
          {message}
        </div>
      )}

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCertificationId ? "Edit Certification" : "Add New Certification"}
      >
        <form
          onSubmit={(e) => {
            ;(editingCertificationId ? handleUpdateSubmit : handleAddSubmit)(e)
            setModalOpen(false)
          }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Certification Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
              {editingCertificationId ? "Update Certification" : "Add Certification"}
            </button>
            {editingCertificationId && (
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

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading certifications...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      ) : certifications.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No certifications</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new certification.</p>
        </div>
      ) : (
        <AdminTable
          items={certifications}
          columns={[{ key: "name", label: "Name" }]}
          onEdit={(item) => handleEdit(item)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </div>
  )
}

export default CertificationForm
