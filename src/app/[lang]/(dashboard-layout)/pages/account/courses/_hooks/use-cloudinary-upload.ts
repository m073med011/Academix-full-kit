"use client"

import { useCallback, useState } from "react"
import {
  deleteFromCloudinary,
  getResourceTypeFromFile,
  uploadToCloudinary,
} from "@/app/[lang]/(dashboard-layout)/pages/account/courses/_services/cloudinary-service"

import type {
  CloudinaryUploadResult,
  ResourceType,
  UploadProgressEvent,
} from "@/app/[lang]/(dashboard-layout)/pages/account/courses/_services/cloudinary-service"

export interface UseCloudinaryUploadReturn {
  upload: (
    file: File,
    resourceType?: ResourceType
  ) => Promise<CloudinaryUploadResult>
  deleteUpload: () => Promise<void>
  isUploading: boolean
  isDeleting: boolean
  progress: number
  error: string | null
  result: CloudinaryUploadResult | null
  reset: () => void
}

/**
 * Custom hook for managing Cloudinary file uploads with progress tracking
 *
 * @example
 * ```tsx
 * const { upload, deleteUpload, isUploading, isDeleting, progress, error, result, reset } = useCloudinaryUpload()
 *
 * const handleUpload = async (file: File) => {
 *   try {
 *     const result = await upload(file, "image")
 *     console.log("Uploaded!", result.secureUrl)
 *   } catch (err) {
 *     console.error("Upload failed", err)
 *   }
 * }
 *
 * const handleDelete = async () => {
 *   try {
 *     await deleteUpload()
 *     console.log("Deleted!")
 *   } catch (err) {
 *     console.error("Delete failed", err)
 *   }
 * }
 * ```
 */
export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CloudinaryUploadResult | null>(null)

  const handleProgress = useCallback((event: UploadProgressEvent) => {
    setProgress(event.percentage)
  }, [])

  const upload = useCallback(
    async (
      file: File,
      resourceType?: ResourceType
    ): Promise<CloudinaryUploadResult> => {
      setIsUploading(true)
      setProgress(0)
      setError(null)
      setResult(null)

      try {
        // Auto-detect resource type if not provided
        const type = resourceType || getResourceTypeFromFile(file)

        const uploadResult = await uploadToCloudinary(
          file,
          type,
          handleProgress
        )

        setResult(uploadResult)
        setProgress(100)

        return uploadResult
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed"
        setError(errorMessage)
        throw err
      } finally {
        setIsUploading(false)
      }
    },
    [handleProgress]
  )

  const deleteUpload = useCallback(async (): Promise<void> => {
    if (!result) return

    setIsDeleting(true)
    setError(null)

    try {
      await deleteFromCloudinary(
        result.publicId,
        result.resourceType as ResourceType
      )
      setResult(null)
      setProgress(0)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Delete failed"
      setError(errorMessage)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }, [result])

  const reset = useCallback(() => {
    setIsUploading(false)
    setIsDeleting(false)
    setProgress(0)
    setError(null)
    setResult(null)
  }, [])

  return {
    upload,
    deleteUpload,
    isUploading,
    isDeleting,
    progress,
    error,
    result,
    reset,
  }
}
