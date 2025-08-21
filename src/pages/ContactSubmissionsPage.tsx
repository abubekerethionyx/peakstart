"use client"

import React, { useState, useEffect } from "react"
import { getContactSubmissions, deleteContactSubmission } from "../services/api"
import AdminModal from "../components/admin/AdminModal"
import AdminTable from "../components/admin/AdminTable"

interface ContactSubmission {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  projectType?: string
  message: string
  budget?: string
  submissionDate?: string
  created_at?: string
}

const ContactSubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)

  const fetchSubmissions = async () => {
    setLoading(true)
    setError(null)
    const response = await getContactSubmissions()
    if (response.success && response.data) {
      setSubmissions(response.data)
    } else {
      setError(response.error || "Failed to fetch contact submissions.")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const handleDelete = async (submissionId: number) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      try {
        const response = await deleteContactSubmission(submissionId)
        if (response.success) {
          setMessage(response.message || "Submission deleted successfully!")
          if (selectedSubmission && selectedSubmission.id === submissionId) {
            setModalOpen(false)
            setSelectedSubmission(null)
          }
          fetchSubmissions()
        } else {
          setIsError(true)
          setMessage(response.error || "Failed to delete submission.")
        }
      } catch (err: any) {
        setIsError(true)
        setMessage(err.message || "An unexpected error occurred.")
      }
    }
  }

  const formatDate = (submission: ContactSubmission) => {
    const dateStr = submission.submissionDate || submission.created_at || ""
    if (!dateStr) return "—"
    try {
      return new Date(dateStr).toLocaleString()
    } catch {
      return dateStr
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Submissions</h2>

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

      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-600 flex items-center justify-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                5.291A7.962 7.962 0 014 12H0c0 3.042 
                1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading submissions...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 font-medium">Error: {error}</div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-gray-600">No contact submissions yet.</div>
        ) : (
          <AdminTable
            items={submissions}
            columns={[
              { key: "date", label: "Date", render: (s: ContactSubmission) => formatDate(s) },
              { key: "name", label: "Name", render: (s: { firstName: any; lastName: any }) => `${s.firstName} ${s.lastName}` },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone", render: (s: ContactSubmission) => s.phone || "N/A" },
              { key: "projectType", label: "Project Type", render: (s: ContactSubmission) => s.projectType || "N/A" },
              {
                key: "message",
                label: "Message",
                render: (s: { message: string }) => <span className="truncate max-w-xs block">{s.message.substring(0, 50)}...</span>,
              },
              { key: "budget", label: "Budget", render: (s: ContactSubmission) => s.budget || "N/A" },
            ]}
            onEdit={(item: React.SetStateAction<ContactSubmission | null>) => {
              setSelectedSubmission(item)
              setModalOpen(true)
            }}
            onDelete={(id: number) => handleDelete(id)}
          />
        )}
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Submission Details">
        {selectedSubmission && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{formatDate(selectedSubmission)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">
                {selectedSubmission.firstName} {selectedSubmission.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{selectedSubmission.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{selectedSubmission.phone || "N/A"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Project Type</p>
              <p className="font-medium">{selectedSubmission.projectType || "N/A"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Message</p>
              <p className="font-medium whitespace-pre-wrap">{selectedSubmission.message}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p className="font-medium">{selectedSubmission.budget || "N/A"}</p>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          {selectedSubmission && (
            <button
              onClick={() => handleDelete(selectedSubmission.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </AdminModal>
    </div>
  )
}

export default ContactSubmissionsPage
