"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createAward, getAwards, updateAward, deleteAward } from "../../services/api" 
import AdminModal from "./AdminModal"
import AdminTable from "./AdminTable"


interface Award {
  id: number
  name: string
  year: string
}

const AwardForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    year: "",
  })
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingAwardId, setEditingAwardId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchAwards = async () => {
    setLoading(true)
    setError(null)
    const response = await getAwards()
    if (response.success && response.data) {
      setAwards(response.data)
    } else {
      setError(response.error || "Failed to fetch awards.")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAwards()
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
      const response = await createAward(formData)
      if (response.success) {
        setMessage(response.message || "Award created successfully!")
        setFormData({
          name: "",
          year: "",
        })
        fetchAwards() // Refresh the list
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to create award.")
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

    if (editingAwardId === null) {
      setIsError(true)
      setMessage("No award selected for update.")
      return
    }

    try {
      const response = await updateAward(editingAwardId, formData)
      if (response.success) {
        setMessage(response.message || "Award updated successfully!")
        setFormData({
          name: "",
          year: "",
        })
        setEditingAwardId(null) // Exit edit mode
        fetchAwards() // Refresh the list
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to update award.")
      }
    } catch (err: any) {
      setIsError(true)
      setMessage(err.message || "An unexpected error occurred.")
    }
  }

  const handleEdit = (award: Award) => {
    setEditingAwardId(award.id)
    setFormData({
      name: award.name,
      year: award.year,
    })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingAwardId(null)
    setFormData({ name: "", year: "" })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleDelete = async (awardId: number) => {
    if (window.confirm("Are you sure you want to delete this award?")) {
      try {
        const response = await deleteAward(awardId)
        if (response.success) {
          setMessage(response.message || "Award deleted successfully!")
          fetchAwards() // Refresh the list
        } else {
          setIsError(true)
          setMessage(response.error || "Failed to delete award.")
        }
      } catch (err: any) {
        setIsError(true)
        setMessage(err.message || "An unexpected error occurred.")
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingAwardId(null)
    setFormData({
      name: "",
      year: "",
    })
    setMessage(null)
    setIsError(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full max-w-none mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Awards</h1>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Award
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`mx-6 mt-4 p-3 rounded-lg border-l-4 ${
                isError ? "bg-red-50 border-red-400 text-red-800" : "bg-green-50 border-green-400 text-green-800"
              }`}
            >
              <span className="font-medium text-sm">{message}</span>
            </div>
          )}

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading awards...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 font-medium">Error: {error}</p>
              </div>
            ) : awards.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Awards Yet</h3>
                <p className="text-gray-500 mb-4">Start by adding your first award.</p>
                <button
                  onClick={handleOpenAdd}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add First Award
                </button>
              </div>
            ) : (
              <AdminTable
                items={awards}
                columns={[
                  { key: "name", label: "Award Name", sortable: true },
                  { key: "year", label: "Year", sortable: true },
                ]}
                onEdit={(item) => handleEdit(item)}
                onDelete={(id) => handleDelete(id)}
              />
            )}
          </div>
        </div>

        <AdminModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingAwardId ? "Edit Award" : "Add New Award"}
          size="md"
        >
          <form
            onSubmit={(e) => {
              ;(editingAwardId ? handleUpdateSubmit : handleAddSubmit)(e)
              setModalOpen(false)
            }}
            className="space-y-6"
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Award Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-900 placeholder-slate-400"
                  placeholder="Enter award name"
                  required
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-semibold text-slate-700 mb-2">
                  Year
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-900 placeholder-slate-400"
                  placeholder="e.g., 2024"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
              {editingAwardId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all duration-200"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                {editingAwardId ? "Update Award" : "Add Award"}
              </button>
            </div>
          </form>
        </AdminModal>
      </div>
    </div>
  )
}

export default AwardForm
