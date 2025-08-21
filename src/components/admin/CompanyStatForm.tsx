"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createCompanyStat, getHomeStats, updateCompanyStat, deleteCompanyStat } from "../../services/api"
import AdminModal from "./AdminModal"
import AdminTable from "./AdminTable"

interface CompanyStat {
  id: number
  number: string
  label: string
  icon_name: string
}

const CompanyStatForm: React.FC = () => {
  const [formData, setFormData] = useState({
    number: "",
    label: "",
    icon_name: "",
  })
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [companyStats, setCompanyStats] = useState<CompanyStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCompanyStatId, setEditingCompanyStatId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchCompanyStats = async () => {
    setLoading(true)
    setError(null)
    const response = await getHomeStats() // Assuming getHomeStats also fetches all for admin
    if (response.success && response.data) {
      setCompanyStats(response.data)
    } else {
      setError(response.error || "Failed to fetch company stats.")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCompanyStats()
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
      const response = await createCompanyStat(formData)
      if (response.success) {
        setMessage(response.message || "Company stat created successfully!")
        setFormData({
          number: "",
          label: "",
          icon_name: "",
        })
        fetchCompanyStats() // Refresh the list
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to create company stat.")
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

    if (editingCompanyStatId === null) {
      setIsError(true)
      setMessage("No company stat selected for update.")
      return
    }

    try {
      const response = await updateCompanyStat(editingCompanyStatId, formData)
      if (response.success) {
        setMessage(response.message || "Company stat updated successfully!")
        setFormData({
          number: "",
          label: "",
          icon_name: "",
        })
        setEditingCompanyStatId(null) // Exit edit mode
        fetchCompanyStats() // Refresh the list
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to update company stat.")
      }
    } catch (err: any) {
      setIsError(true)
      setMessage(err.message || "An unexpected error occurred.")
    }
  }

  const handleEdit = (companyStat: CompanyStat) => {
    setEditingCompanyStatId(companyStat.id)
    setFormData({
      number: companyStat.number,
      label: companyStat.label,
      icon_name: companyStat.icon_name,
    })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingCompanyStatId(null)
    setFormData({ number: "", label: "", icon_name: "" })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleDelete = async (companyStatId: number) => {
    if (window.confirm("Are you sure you want to delete this company stat?")) {
      try {
        const response = await deleteCompanyStat(companyStatId)
        if (response.success) {
          setMessage(response.message || "Company stat deleted successfully!")
          fetchCompanyStats() // Refresh the list
        } else {
          setIsError(true)
          setMessage(response.error || "Failed to delete company stat.")
        }
      } catch (err: any) {
        setIsError(true)
        setMessage(err.message || "An unexpected error occurred.")
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingCompanyStatId(null)
    setFormData({
      number: "",
      label: "",
      icon_name: "",
    })
    setMessage(null)
    setIsError(false)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Company Statistics</h2>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Company Stat
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg mb-4 text-sm font-medium ${isError ? "bg-red-50 text-red-800 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"}`}
        >
          {message}
        </div>
      )}

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCompanyStatId ? "Edit Company Stat" : "Add New Company Stat"}
      >
        <form
          onSubmit={(e) => {
            ;(editingCompanyStatId ? handleUpdateSubmit : handleAddSubmit)(e)
            setModalOpen(false)
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
              Number
            </label>
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              placeholder="e.g., 500+"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              placeholder="e.g., Projects Completed"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="icon_name" className="block text-sm font-medium text-gray-700 mb-1">
              Icon Name
            </label>
            <input
              type="text"
              id="icon_name"
              name="icon_name"
              value={formData.icon_name}
              onChange={handleInputChange}
              placeholder="e.g., CheckCircle, Clock"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            {editingCompanyStatId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {editingCompanyStatId ? "Update Stat" : "Add Stat"}
            </button>
          </div>
        </form>
      </AdminModal>

      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading company stats...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        ) : companyStats.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-lg font-medium mb-2">No company stats yet</p>
            <p className="text-sm">Add your first company statistic to get started.</p>
          </div>
        ) : (
          <AdminTable
            items={companyStats}
            columns={[
              { key: "number", label: "Number" },
              { key: "label", label: "Label" },
              { key: "icon_name", label: "Icon Name" },
            ]}
            onEdit={(item) => handleEdit(item)}
            onDelete={(id) => handleDelete(id)}
          />
        )}
      </div>
    </div>
  )
}

export default CompanyStatForm
