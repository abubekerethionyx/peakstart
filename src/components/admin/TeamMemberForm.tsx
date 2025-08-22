"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createTeamMember, getTeamMembers, updateTeamMember, deleteTeamMember } from "../../services/api"
import AdminModal from "./AdminModal"
import AdminTable from "./AdminTable"

interface TeamMember {
  id: number
  name: string
  position: string
  experience: string
  image: string
  bio: string
}

const TeamMemberForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    experience: "",
    image: "",
    bio: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTeamMemberId, setEditingTeamMemberId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchTeamMembers = async () => {
    setLoading(true)
    setError(null)
    const response = await getTeamMembers()
    if (response.success && response.data) {
      setTeamMembers(response.data)
    } else {
      setError(response.error || "Failed to fetch team members.")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTeamMembers()
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

    try {
      const data: any = { ...formData }
      if (imageFile) data.file = imageFile
      const response = await createTeamMember(data)
      if (response.success) {
        setMessage(response.message || "Team member created successfully!")
        setFormData({ name: "", position: "", experience: "", image: "", bio: "" })
        setImageFile(null)
        fetchTeamMembers()
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to create team member.")
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

    if (editingTeamMemberId === null) {
      setIsError(true)
      setMessage("No team member selected for update.")
      return
    }

    try {
      const data: any = { ...formData }
      if (imageFile) data.file = imageFile
      const response = await updateTeamMember(editingTeamMemberId, data)
      if (response.success) {
        setMessage(response.message || "Team member updated successfully!")
        setFormData({ name: "", position: "", experience: "", image: "", bio: "" })
        setEditingTeamMemberId(null)
        setImageFile(null)
        fetchTeamMembers()
      } else {
        setIsError(true)
        setMessage(response.error || "Failed to update team member.")
      }
    } catch (err: any) {
      setIsError(true)
      setMessage(err.message || "An unexpected error occurred.")
    }
  }

  const handleEdit = (teamMember: TeamMember) => {
    setEditingTeamMemberId(teamMember.id)
    setFormData({
      name: teamMember.name,
      position: teamMember.position,
      experience: teamMember.experience,
      image: teamMember.image,
      bio: teamMember.bio,
    })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingTeamMemberId(null)
    setFormData({ name: "", position: "", experience: "", image: "", bio: "" })
    setMessage(null)
    setIsError(false)
    setModalOpen(true)
  }

  const handleDelete = async (teamMemberId: number) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        const response = await deleteTeamMember(teamMemberId)
        if (response.success) {
          setMessage(response.message || "Team member deleted successfully!")
          fetchTeamMembers()
        } else {
          setIsError(true)
          setMessage(response.error || "Failed to delete team member.")
        }
      } catch (err: any) {
        setIsError(true)
        setMessage(err.message || "An unexpected error occurred.")
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingTeamMemberId(null)
    setFormData({ name: "", position: "", experience: "", image: "", bio: "" })
    setMessage(null)
    setIsError(false)
    setImageFile(null)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Team Member
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            isError ? "bg-red-50 text-red-800 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"
          } text-sm font-medium`}
        >
          {message}
        </div>
      )}

      {/* Modal Form */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTeamMemberId ? "Edit Team Member" : "Add New Team Member"}
      >
        <form
          onSubmit={(e) => {
            ;(editingTeamMemberId ? handleUpdateSubmit : handleAddSubmit)(e)
            setModalOpen(false)
          }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-1">
              Position
            </label>
            <input type="text" id="position" name="position" value={formData.position} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-1">
              Experience
            </label>
            <input type="text" id="experience" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="e.g., 10+ years" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label htmlFor="imageFile" className="block text-sm font-semibold text-gray-700 mb-1">Upload Image</label>
            <input type="file" id="imageFile" name="imageFile" onChange={handleFileChange} accept="image/*" className="w-full" />
            <p className="text-xs text-gray-500 mt-1">Or provide an image URL below (file upload takes precedence)</p>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1 mt-3">Image URL</label>
            <input type="text" id="image" name="image" value={formData.image} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-1">
              Bio
            </label>
            <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div className="flex justify-center space-x-4">
            <button type="submit" className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              {editingTeamMemberId ? "Update Member" : "Add Member"}
            </button>
            {editingTeamMemberId && (
              <button type="button" onClick={handleCancelEdit} className="px-6 py-3 border rounded-md bg-white text-gray-700 hover:bg-gray-50">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </AdminModal>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">Loading team members...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">Error: {error}</div>
        ) : teamMembers.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first team member.</p>
            <button onClick={handleOpenAdd} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Add Your First Member
            </button>
          </div>
        ) : (
          <AdminTable
            items={teamMembers}
            columns={[
              { key: "name", label: "Name" },
              { key: "position", label: "Position" },
              { key: "experience", label: "Experience" },
              {
                key: "image",
                label: "Image",
                render: (item: TeamMember) => <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded-md" />,
              },
              {
                key: "bio",
                label: "Bio",
                render: (item: TeamMember) => (item.bio.length > 50 ? item.bio.substring(0, 50) + "..." : item.bio),
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

export default TeamMemberForm
