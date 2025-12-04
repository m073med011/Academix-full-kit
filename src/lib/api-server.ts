import { getServerSession } from "next-auth"

import type { ApiError, ApiResponse } from "@/types/api"

import { authOptions } from "@/configs/next-auth"

import { ApiClientError } from "./api-client"

// API Client Configuration
const API_BASE_URL =
  process.env.LMS_BACKEND_URL ||
  process.env.NEXT_PUBLIC_LMS_BACKEND_URL ||
  "http://localhost:5000/api"

// Request configuration type
interface RequestConfig extends RequestInit {
  skipAuth?: boolean
}

// Server-side API client class
class ApiServerClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { skipAuth = false, ...fetchConfig } = config

    const url = `${this.baseUrl}${endpoint}`
    // Use Headers API for better type safety
    const headers = new Headers(fetchConfig.headers)
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }

    // Add authorization header if not skipped
    if (!skipAuth) {
      const session = await getServerSession(authOptions)
      if (session?.accessToken) {
        headers.set("Authorization", `Bearer ${session.accessToken}`)
      }
    }

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
      })

      // Handle 401
      if (response.status === 401 && !skipAuth) {
        throw new ApiClientError("Session expired or invalid", 401)
      }

      const data = (await response.json()) as ApiResponse<T> & {
        error?: string
      }

      if (!response.ok) {
        throw new ApiClientError(
          data.error || data.message || "Request failed",
          response.status,
          data as unknown as ApiError
        )
      }

      return data
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error
      }

      throw new ApiClientError(
        error instanceof Error ? error.message : "Network error",
        0
      )
    }
  }

  // HTTP Methods
  async get<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" })
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" })
  }
}

// Export singleton instance
export const apiServer = new ApiServerClient()

// Export class for custom instances
export { ApiServerClient }
