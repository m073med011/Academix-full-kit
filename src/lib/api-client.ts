import type { ApiError, ApiResponse } from "@/types/api"

// API Client Configuration
const API_BASE_URL =
  process.env.LMS_BACKEND_URL ||
  process.env.NEXT_PUBLIC_LMS_BACKEND_URL ||
  "http://localhost:5000/api"

// Token storage keys
const ACCESS_TOKEN_KEY = "lms_access_token"
const REFRESH_TOKEN_KEY = "lms_refresh_token"

// Client-side token management
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  clearTokens: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  hasTokens: (): boolean => {
    return !!tokenStorage.getAccessToken() && !!tokenStorage.getRefreshToken()
  },
}

// Request configuration type
interface RequestConfig extends RequestInit {
  skipAuth?: boolean
  skipRefresh?: boolean
}

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

// Refresh token function
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken()

  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      tokenStorage.clearTokens()
      return false
    }

    const data = await response.json()

    if (data.success && data.data?.accessToken && data.data?.refreshToken) {
      tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken)
      return true
    }

    tokenStorage.clearTokens()
    return false
  } catch {
    tokenStorage.clearTokens()
    return false
  }
}

// Main API client class
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { skipAuth = false, skipRefresh = false, ...fetchConfig } = config

    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...fetchConfig.headers,
    }

    // Add authorization header if not skipped and token exists
    if (!skipAuth) {
      const accessToken = tokenStorage.getAccessToken()
      if (accessToken) {
        ;(headers as Record<string, string>)["Authorization"] =
          `Bearer ${accessToken}`
      }
    }

    try {
      let response = await fetch(url, {
        ...fetchConfig,
        headers,
      })

      // Handle 401 - try to refresh token
      if (response.status === 401 && !skipAuth && !skipRefresh) {
        // Prevent multiple simultaneous refresh attempts
        if (!isRefreshing) {
          isRefreshing = true
          refreshPromise = refreshAccessToken()
        }

        const refreshed = await refreshPromise
        isRefreshing = false
        refreshPromise = null

        if (refreshed) {
          // Retry the request with new token
          const newAccessToken = tokenStorage.getAccessToken()
          if (newAccessToken) {
            ;(headers as Record<string, string>)["Authorization"] =
              `Bearer ${newAccessToken}`
          }

          response = await fetch(url, {
            ...fetchConfig,
            headers,
          })
        } else {
          // Refresh failed, clear tokens
          tokenStorage.clearTokens()
          throw new ApiClientError("Session expired. Please login again.", 401)
        }
      }

      const data = await response.json()

      if (!response.ok) {
        throw new ApiClientError(
          data.error || data.message || "Request failed",
          response.status,
          data
        )
      }

      return data as ApiResponse<T>
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

  // File upload with multipart form data
  async upload<T>(
    endpoint: string,
    formData: FormData,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const {
      skipAuth = false,
      skipRefresh = false,
      ...fetchConfig
    } = config || {}

    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = { ...fetchConfig.headers }

    // Don't set Content-Type for FormData - browser will set it with boundary
    delete (headers as Record<string, string>)["Content-Type"]

    if (!skipAuth) {
      const accessToken = tokenStorage.getAccessToken()
      if (accessToken) {
        ;(headers as Record<string, string>)["Authorization"] =
          `Bearer ${accessToken}`
      }
    }

    const response = await fetch(url, {
      ...fetchConfig,
      method: "POST",
      headers,
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiClientError(
        data.error || data.message || "Upload failed",
        response.status,
        data
      )
    }

    return data as ApiResponse<T>
  }
}

// Custom error class for API errors
export class ApiClientError extends Error {
  public statusCode: number
  public data?: ApiError

  constructor(message: string, statusCode: number, data?: ApiError) {
    super(message)
    this.name = "ApiClientError"
    this.statusCode = statusCode
    this.data = data
  }

  isUnauthorized(): boolean {
    return this.statusCode === 401
  }

  isForbidden(): boolean {
    return this.statusCode === 403
  }

  isNotFound(): boolean {
    return this.statusCode === 404
  }

  isValidationError(): boolean {
    return this.statusCode === 400
  }

  isConflict(): boolean {
    return this.statusCode === 409
  }

  isServerError(): boolean {
    return this.statusCode >= 500
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export class for custom instances
export { ApiClient }

// Server-side API client (without token refresh logic)
export function createServerApiClient(accessToken?: string) {
  const serverClient = {
    async request<T>(
      endpoint: string,
      config: RequestInit = {}
    ): Promise<ApiResponse<T>> {
      const url = `${API_BASE_URL}${endpoint}`
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...config.headers,
      }

      if (accessToken) {
        ;(headers as Record<string, string>)["Authorization"] =
          `Bearer ${accessToken}`
      }

      const response = await fetch(url, {
        ...config,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new ApiClientError(
          data.error || data.message || "Request failed",
          response.status,
          data
        )
      }

      return data as ApiResponse<T>
    },

    get<T>(endpoint: string, config?: RequestInit): Promise<ApiResponse<T>> {
      return serverClient.request<T>(endpoint, { ...config, method: "GET" })
    },

    post<T>(
      endpoint: string,
      data?: unknown,
      config?: RequestInit
    ): Promise<ApiResponse<T>> {
      return serverClient.request<T>(endpoint, {
        ...config,
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      })
    },

    put<T>(
      endpoint: string,
      data?: unknown,
      config?: RequestInit
    ): Promise<ApiResponse<T>> {
      return serverClient.request<T>(endpoint, {
        ...config,
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      })
    },

    delete<T>(endpoint: string, config?: RequestInit): Promise<ApiResponse<T>> {
      return serverClient.request<T>(endpoint, { ...config, method: "DELETE" })
    },
  }

  return serverClient
}
