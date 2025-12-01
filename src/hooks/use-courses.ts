"use client"

import { useCallback, useEffect, useState } from "react"

import type {
  Course,
  CourseFilterParams,
  CourseListResponse,
  CoursePagination,
} from "@/types/api"

import { apiClient, ApiClientError } from "@/lib/api-client"

interface UseCoursesResult {
  courses: Course[]
  pagination: CoursePagination | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setFilters: (filters: CourseFilterParams) => void
}

export function useCourses(
  initialFilters: CourseFilterParams = {}
): UseCoursesResult {
  const [courses, setCourses] = useState<Course[]>([])
  const [pagination, setPagination] = useState<CoursePagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CourseFilterParams>(initialFilters)

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query params
      const params = new URLSearchParams()
      if (filters.page) params.append("page", filters.page.toString())
      if (filters.limit) params.append("limit", filters.limit.toString())
      if (filters.category) params.append("category", filters.category)
      if (filters.level) params.append("level", filters.level)
      if (filters.search) params.append("search", filters.search)

      const endpoint = `/courses${params.toString() ? `?${params.toString()}` : ""}`

      const response = await apiClient.get<any>(endpoint, {
        skipAuth: true, // Public endpoint
      })

      if (response.success) {
        // Backend returns { success, data: Course[], pagination }
        setCourses(response.data || [])
        setPagination(response.pagination || null)
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError("Failed to fetch courses. Please try again later.")
      }
      console.error("Error fetching courses:", err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  return {
    courses,
    pagination,
    loading,
    error,
    refetch: fetchCourses,
    setFilters,
  }
}
