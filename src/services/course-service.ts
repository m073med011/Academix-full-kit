import type {
  ApiResponse,
  Course,
  CreateCourseRequest,
  CreateMaterialRequest,
  Material,
  PaginatedResponse,
  UpdateCourseRequest,
} from "@/types/api"

import { ApiClientError, apiClient } from "@/lib/api-client"

// Course query parameters
interface CourseQueryParams {
  page?: number
  limit?: number
  category?: string
  level?: string
  isPublished?: boolean
  search?: string
}

// Course service for client-side course operations
export const courseService = {
  // ============================================
  // Course CRUD Operations
  // ============================================

  /**
   * Get all courses with pagination and filters
   */
  async getCourses(
    params: CourseQueryParams = {}
  ): Promise<PaginatedResponse<Course>> {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.set("page", String(params.page))
    if (params.limit) queryParams.set("limit", String(params.limit))
    if (params.category) queryParams.set("category", params.category)
    if (params.level) queryParams.set("level", params.level)
    if (params.isPublished !== undefined)
      queryParams.set("isPublished", String(params.isPublished))
    if (params.search) queryParams.set("search", params.search)

    const queryString = queryParams.toString()
    const endpoint = `/courses${queryString ? `?${queryString}` : ""}`

    const response = await apiClient.get<PaginatedResponse<Course>["data"]>(
      endpoint,
      { skipAuth: true }
    )

    return response as unknown as PaginatedResponse<Course>
  },

  /**
   * Get a single course by ID
   */
  async getCourse(id: string): Promise<Course> {
    const response = await apiClient.get<Course>(`/courses/${id}`, {
      skipAuth: true,
    })

    if (response.success && response.data) {
      return response.data
    }

    throw new ApiClientError("Course not found", 404)
  },

  /**
   * Get courses by instructor
   */
  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    const response = await apiClient.get<Course[]>(
      `/courses/instructor/${instructorId}`
    )

    if (response.success && response.data) {
      return response.data
    }

    return []
  },

  /**
   * Get user's purchased courses
   */
  async getPurchasedCourses(): Promise<Course[]> {
    const response = await apiClient.get<Course[]>("/courses/user/purchased")

    if (response.success && response.data) {
      return response.data
    }

    return []
  },

  /**
   * Create a new course
   */
  async createCourse(data: CreateCourseRequest): Promise<Course> {
    const response = await apiClient.post<Course>("/courses", data)

    if (response.success && response.data) {
      return response.data
    }

    throw new ApiClientError("Failed to create course", 400)
  },

  /**
   * Update a course
   */
  async updateCourse(id: string, data: UpdateCourseRequest): Promise<Course> {
    const response = await apiClient.put<Course>(`/courses/${id}`, data)

    if (response.success && response.data) {
      return response.data
    }

    throw new ApiClientError("Failed to update course", 400)
  },

  /**
   * Delete a course
   */
  async deleteCourse(id: string): Promise<void> {
    const response = await apiClient.delete<void>(`/courses/${id}`)

    if (!response.success) {
      throw new ApiClientError("Failed to delete course", 400)
    }
  },

  /**
   * Enroll in a course
   */
  async enrollInCourse(courseId: string): Promise<void> {
    const response = await apiClient.post<void>(`/courses/${courseId}/enroll`)

    if (!response.success) {
      throw new ApiClientError("Failed to enroll in course", 400)
    }
  },

  // ============================================
  // Course Editors
  // ============================================

  /**
   * Add an editor to a course
   */
  async addEditor(courseId: string, editorId: string): Promise<void> {
    const response = await apiClient.post<void>(
      `/courses/${courseId}/editors`,
      {
        editorId,
      }
    )

    if (!response.success) {
      throw new ApiClientError("Failed to add editor", 400)
    }
  },

  /**
   * Remove an editor from a course
   */
  async removeEditor(courseId: string, editorId: string): Promise<void> {
    const response = await apiClient.delete<void>(
      `/courses/${courseId}/editors/${editorId}`
    )

    if (!response.success) {
      throw new ApiClientError("Failed to remove editor", 400)
    }
  },

  // ============================================
  // Course Materials
  // ============================================

  /**
   * Get materials for a course
   */
  async getCourseMaterials(courseId: string): Promise<Material[]> {
    const response = await apiClient.get<Material[]>(
      `/materials/course/${courseId}`,
      { skipAuth: true }
    )

    if (response.success && response.data) {
      return response.data
    }

    return []
  },

  /**
   * Get a single material by ID
   */
  async getMaterial(id: string): Promise<Material> {
    const response = await apiClient.get<Material>(`/materials/${id}`)

    if (response.success && response.data) {
      return response.data
    }

    throw new ApiClientError("Material not found", 404)
  },

  /**
   * Create a new material
   */
  async createMaterial(data: CreateMaterialRequest): Promise<Material> {
    const response = await apiClient.post<Material>("/materials", data)

    if (response.success && response.data) {
      return response.data
    }

    throw new ApiClientError("Failed to create material", 400)
  },

  /**
   * Upload material with file
   */
  async uploadMaterial(
    data: Omit<CreateMaterialRequest, "fileUrl">,
    file: File
  ): Promise<Material> {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("courseId", data.courseId)
    formData.append("type", data.type)
    if (data.description) formData.append("description", data.description)
    if (data.duration) formData.append("duration", String(data.duration))
    if (data.order) formData.append("order", String(data.order))
    formData.append("file", file)

    const response = await apiClient.upload<Material>("/materials", formData)

    if (response.success && response.data) {
      return response.data
    }

    throw new ApiClientError("Failed to upload material", 400)
  },

  /**
   * Update a material
   */
  async updateMaterial(
    id: string,
    data: Partial<CreateMaterialRequest>
  ): Promise<Material> {
    const response = await apiClient.put<Material>(`/materials/${id}`, data)

    if (response.success && response.data) {
      return response.data
    }

    throw new ApiClientError("Failed to update material", 400)
  },

  /**
   * Delete a material
   */
  async deleteMaterial(id: string): Promise<void> {
    const response = await apiClient.delete<void>(`/materials/${id}`)

    if (!response.success) {
      throw new ApiClientError("Failed to delete material", 400)
    }
  },

  /**
   * Reorder materials
   */
  async reorderMaterials(
    materials: { id: string; order: number }[]
  ): Promise<void> {
    const response = await apiClient.post<void>("/materials/reorder", {
      materials,
    })

    if (!response.success) {
      throw new ApiClientError("Failed to reorder materials", 400)
    }
  },
}

// Server-side course service
export function createServerCourseService(accessToken?: string) {
  const API_URL = process.env.LMS_BACKEND_URL || "http://localhost:5000/api"

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (accessToken) {
    ;(headers as Record<string, string>)["Authorization"] =
      `Bearer ${accessToken}`
  }

  return {
    async getCourses(
      params: CourseQueryParams = {}
    ): Promise<ApiResponse<Course[]>> {
      const queryParams = new URLSearchParams()

      if (params.page) queryParams.set("page", String(params.page))
      if (params.limit) queryParams.set("limit", String(params.limit))
      if (params.category) queryParams.set("category", params.category)
      if (params.level) queryParams.set("level", params.level)

      const queryString = queryParams.toString()
      const endpoint = `/courses${queryString ? `?${queryString}` : ""}`

      const response = await fetch(`${API_URL}${endpoint}`, { headers })
      return response.json()
    },

    async getCourse(id: string): Promise<ApiResponse<Course>> {
      const response = await fetch(`${API_URL}/courses/${id}`, { headers })
      return response.json()
    },

    async getPurchasedCourses(): Promise<ApiResponse<Course[]>> {
      const response = await fetch(`${API_URL}/courses/user/purchased`, {
        headers,
      })
      return response.json()
    },
  }
}

export { ApiClientError }
