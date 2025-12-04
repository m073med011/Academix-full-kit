# API Client Architecture

This document explains the consistent architecture between client-side and server-side API clients.

---

## 🏗️ Architecture Consistency

Both `api-client.ts` and `api-server.ts` follow the **exact same architectural pattern**:

### File Structure (Identical Order)

```
1. Type Imports
2. API_BASE_URL Configuration
3. Token Storage Keys/Config
4. Token Storage Object (tokenStorage / serverTokenStorage)
5. RequestConfig Interface
6. [Client only: Token Refresh Logic]
7. Main API Client Class (ApiClient / ServerApiClient)
8. [Client only: ApiClientError Class]
9. Singleton Export
10. Class Export
11. Helper Factory Functions
```

---

## 📊 Side-by-Side Comparison

| Component | Client (`api-client.ts`) | Server (`api-server.ts`) |
|-----------|--------------------------|--------------------------|
| **Storage** | `tokenStorage` | `serverTokenStorage` |
| **Storage Type** | localStorage | HTTP-only cookies |
| **Storage Methods** | sync | async (Next.js 15+) |
| **Config Interface** | `RequestConfig` | `ServerRequestConfig` |
| **Main Class** | `ApiClient` | `ServerApiClient` |
| **Singleton** | `apiClient` | `serverApiClient` |
| **Token Refresh** | ✅ Automatic | ❌ Stateless |
| **Error Class** | `ApiClientError` | Re-exported from client |
| **Cache Control** | Browser default | `no-store` for Next.js |

---

## 🔍 Detailed Architecture Breakdown

### 1. Token Storage Object

**Client Pattern:**
```typescript
export const tokenStorage = {
  getAccessToken: (): string | null => { /* localStorage */ },
  getRefreshToken: (): string | null => { /* localStorage */ },
  setTokens: (access, refresh): void => { /* localStorage */ },
  clearTokens: (): void => { /* localStorage */ },
  hasTokens: (): boolean => { /* check both */ },
}
```

**Server Pattern (Same structure, async):**
```typescript
export const serverTokenStorage = {
  getAccessToken: async (): Promise<string | null> => { /* cookies */ },
  getRefreshToken: async (): Promise<string | null> => { /* cookies */ },
  setTokens: async (access, refresh): Promise<void> => { /* cookies */ },
  clearTokens: async (): Promise<void> => { /* cookies */ },
  hasTokens: async (): Promise<boolean> => { /* check both */ },
}
```

**Why Async on Server?**
- Next.js 15+ changed `cookies()` to return a Promise
- Maintains consistency with Next.js App Router

---

### 2. Request Config Interface

**Client:**
```typescript
interface RequestConfig extends RequestInit {
  skipAuth?: boolean
  skipRefresh?: boolean  // Client-specific
}
```

**Server:**
```typescript
interface ServerRequestConfig extends RequestInit {
  skipAuth?: boolean
  // No skipRefresh (server is stateless)
}
```

---

### 3. Main API Client Class

Both classes have **identical structure**:

```typescript
class ApiClient / ServerApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL)

  private async request<T>(endpoint, config): Promise<ApiResponse<T>>

  // HTTP Methods (identical signatures)
  async get<T>(endpoint, config?): Promise<ApiResponse<T>>
  async post<T>(endpoint, data?, config?): Promise<ApiResponse<T>>
  async put<T>(endpoint, data?, config?): Promise<ApiResponse<T>>
  async patch<T>(endpoint, data?, config?): Promise<ApiResponse<T>>
  async delete<T>(endpoint, config?): Promise<ApiResponse<T>>
  async upload<T>(endpoint, formData, config?): Promise<ApiResponse<T>>
}
```

**Key Difference:**
- **Client**: Has token refresh logic in `request()` method
- **Server**: No refresh (clears cookies on 401)

---

### 4. Error Handling

**Client:**
```typescript
export class ApiClientError extends Error {
  public statusCode: number
  public data?: ApiError

  constructor(message, statusCode, data?)

  isUnauthorized(): boolean
  isForbidden(): boolean
  isNotFound(): boolean
  isValidationError(): boolean
  isConflict(): boolean
  isServerError(): boolean
}
```

**Server:**
```typescript
// Re-exports from client for consistency
import { ApiClientError } from "./api-client"
```

---

### 5. Singleton Pattern

**Client:**
```typescript
// Export singleton instance
export const apiClient = new ApiClient()

// Export class for custom instances
export { ApiClient }
```

**Server:**
```typescript
// Export singleton instance
export const serverApiClient = new ServerApiClient()

// Export class for custom instances
export { ServerApiClient }
```

---

## 🎯 Usage Pattern Consistency

### Client Usage
```typescript
import { apiClient, tokenStorage } from '@/lib/api-client'

// Use singleton
const users = await apiClient.get('/users')

// Check tokens
if (tokenStorage.hasTokens()) {
  // Authenticated
}

// Clear tokens
tokenStorage.clearTokens()
```

### Server Usage
```typescript
import { serverApiClient, serverTokenStorage } from '@/lib/api-server'

// Use singleton
const users = await serverApiClient.get('/users')

// Check tokens (async)
if (await serverTokenStorage.hasTokens()) {
  // Authenticated
}

// Clear tokens (async)
await serverTokenStorage.clearTokens()
```

**Notice:** Identical API surface, just add `await` for server token storage!

---

## 🔐 Security Architecture

### Client Security
- ❌ localStorage (vulnerable to XSS)
- ✅ Token refresh (better UX)
- ✅ Automatic retry on 401
- ⚠️ Tokens accessible to JavaScript

### Server Security
- ✅ HTTP-only cookies (XSS protection)
- ✅ Secure flag in production
- ✅ SameSite CSRF protection
- ✅ Tokens not accessible to JavaScript
- ❌ No refresh (stateless by design)

---

## 📦 Factory Functions

### Client
```typescript
// For server-side use within client package
export function createServerApiClient(accessToken?: string) {
  // Simple object with HTTP methods
  return { request, get, post, put, delete }
}
```

### Server
```typescript
// For explicit token passing (mobile apps, custom auth)
export function createClientWithToken(accessToken?: string) {
  // Simple object with HTTP methods
  return { request, get, post, put, delete }
}
```

---

## 🧪 Testing Consistency

Both clients can be tested with the same test patterns:

```typescript
// Client tests
describe('ApiClient', () => {
  it('should make GET request', async () => {
    const client = new ApiClient()
    const response = await client.get('/users')
    expect(response.success).toBe(true)
  })
})

// Server tests (same structure)
describe('ServerApiClient', () => {
  it('should make GET request', async () => {
    const client = new ServerApiClient()
    const response = await client.get('/users')
    expect(response.success).toBe(true)
  })
})
```

---

## 🎨 Code Style Consistency

### Comment Style
```typescript
// Single-line comments for sections
// No excessive JSDoc (only where needed)
```

### Naming Conventions
```typescript
// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = "..."
const ACCESS_TOKEN_KEY = "..."

// Functions: camelCase
getAccessToken()
setTokens()

// Classes: PascalCase
class ApiClient
class ServerApiClient

// Singletons: camelCase with suffix
apiClient
serverApiClient

// Storage objects: camelCase with suffix
tokenStorage
serverTokenStorage
```

### Method Order
```typescript
1. get<T>()
2. post<T>()
3. put<T>()
4. patch<T>()
5. delete<T>()
6. upload<T>()
```

---

## 🔄 Migration Path

If you need to migrate from client to server (or vice versa):

### Client → Server
```typescript
// Before (Client Component)
import { apiClient, tokenStorage } from '@/lib/api-client'

const users = await apiClient.get('/users')
if (tokenStorage.hasTokens()) { /* ... */ }
tokenStorage.clearTokens()

// After (Server Component)
import { serverApiClient, serverTokenStorage } from '@/lib/api-server'

const users = await serverApiClient.get('/users')
if (await serverTokenStorage.hasTokens()) { /* ... */ }
await serverTokenStorage.clearTokens()
```

**Changes Required:**
1. Import path: `api-client` → `api-server`
2. Client name: `apiClient` → `serverApiClient`
3. Storage name: `tokenStorage` → `serverTokenStorage`
4. Add `await` for storage methods

---

## ✅ Benefits of This Architecture

### 1. **Consistency**
- Same mental model for both environments
- Easy context switching between client/server code
- Reduced cognitive load

### 2. **Maintainability**
- Changes in one file guide changes in the other
- Consistent patterns make code reviews easier
- New developers learn one pattern

### 3. **Type Safety**
- Shared types between client and server
- TypeScript catches environment mismatches
- IDE autocompletion works seamlessly

### 4. **Testability**
- Same test patterns for both
- Mock strategies are consistent
- Easier to maintain test suites

### 5. **Scalability**
- Easy to add new HTTP methods
- Consistent error handling
- Simple to extend functionality

---

## 📚 Summary

| Aspect | Implementation |
|--------|----------------|
| **Architecture** | Mirror pattern with environment-specific adapters |
| **Storage** | Client: localStorage, Server: HTTP-only cookies |
| **API Surface** | Identical (server adds `await` for storage) |
| **Error Handling** | Shared `ApiClientError` class |
| **Token Refresh** | Client: yes, Server: no (by design) |
| **Singleton Pattern** | Both use singleton + class export |
| **Factory Functions** | Both provide helpers for edge cases |
| **Code Style** | Identical naming, ordering, comments |
| **Type Safety** | Shared types from `@/types/api` |
| **Testing** | Same patterns, same assertions |

---

This architecture ensures **maximum consistency** while respecting the unique requirements of each environment. The result is a codebase that's easy to understand, maintain, and extend! 🎯
