"use client"

import React from "react"
import { useState } from "react"

interface AdminTableProps<T> {
  items: T[]
  columns: {
    key: string
    label: string
    sortable?: boolean
    render?: (item: T) => React.ReactNode
  }[]
  onEdit: (item: T) => void
  onDelete: (id: number) => void
  onView?: (item: T) => void
  loading?: boolean
  selectable?: boolean
  onSelectionChange?: (selectedIds: number[]) => void
}

function AdminTable<T extends { id: number }>({
  items,
  columns,
  onEdit,
  onDelete,
  onView,
  loading = false,
  selectable = false,
  onSelectionChange,
}: AdminTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? items.map((item) => item.id) : []
    setSelectedIds(newSelection)
    onSelectionChange?.(newSelection)
  }

  const handleSelectItem = (id: number, checked: boolean) => {
    const newSelection = checked ? [...selectedIds, id] : selectedIds.filter((selectedId) => selectedId !== id)
    setSelectedIds(newSelection)
    onSelectionChange?.(newSelection)
  }

  const sortedItems = React.useMemo(() => {
    if (!sortConfig) return items

    return [...items].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key]
      const bValue = (b as any)[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }, [items, sortConfig])

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-gray-50/50 px-4 py-3">
            <div className="flex space-x-4">
              {columns.map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 rounded flex-1"></div>
              ))}
            </div>
          </div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="px-4 py-3 border-t border-gray-100">
              <div className="flex space-x-4">
                {columns.map((_, colIndex) => (
                  <div key={colIndex} className="h-4 bg-gray-100 rounded flex-1"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === items.length && items.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide ${
                    col.sortable ? "cursor-pointer hover:bg-gray-100 select-none" : ""
                  }`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="ml-1">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === "asc" ? (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )
                        ) : (
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {sortedItems.map((item, index) => (
              <tr
                key={item.id}
                className={`
                  transition-colors duration-150 hover:bg-gray-25 
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-25/30"}
                  ${selectedIds.includes(item.id) ? "bg-blue-50" : ""}
                `}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-gray-900">
                    <div className="font-medium">{col.render ? col.render(item) : (item as any)[col.key]}</div>
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(item)}
                        className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        aria-label={`View item ${item.id}`}
                      >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        View
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(item)}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      aria-label={`Edit item ${item.id}`}
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
                      aria-label={`Delete item ${item.id}`}
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-12 0H4m8 0V9"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first item.</p>
        </div>
      )}
    </div>
  )
}

export default AdminTable
