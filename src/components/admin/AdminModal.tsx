"use client"

import type React from "react"
import { useEffect } from "react"
import { X } from "lucide-react"

interface AdminModalProps {
  open: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  showCloseButton?: boolean
}

const AdminModal: React.FC<AdminModalProps> = ({
  open,
  title,
  onClose,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, onClose])

  if (!open) return null

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`
          relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]}
          transform transition-all duration-300 ease-out
          animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4
          border border-gray-200/50
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            {title && (
              <h3 id="modal-title" className="text-xl font-semibold text-gray-900 leading-6">
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="
                  p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                  rounded-lg transition-colors duration-200 focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                "
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

export default AdminModal
