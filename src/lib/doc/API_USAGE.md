# API Client Usage Guide

Complete guide for using client-side and server-side API clients in Next.js 14+ App Router.

---

## 📁 File Structure

```
src/lib/
├── api-client.ts    # Client-side API client (browser only)
├── api-server.ts    # Server-side API client (server only)
└── API_USAGE.md     # This file
```

---

## 🎯 When to Use Which Client

| Context | Use | Import |
|---------|-----|--------|
| Client Components | `api-client.ts` | `import { apiClient } from '@/lib/api-client'` |
| Server Components | `api-server.ts` | `import { createServerClient } from '@/lib/api-server'` |
| API Routes | `api-server.ts` | `import { createServerClient } from '@/lib/api-server'` |
| Server Actions | `api-server.ts` | `import { createServerClient } from '@/lib/api-server'` |
| Middleware | `api-server.ts` | `import { createClientWithToken } from '@/lib/api-server'` |

---

## 🖥️ Client-Side Usage (`api-client.ts`)

### Basic Usage in Client Components

```tsx
'use client'

import { apiClient } from '@/lib/api-client'
import { useEffect, useState } from 'react'

export default function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await apiClient.get('/users/profile')
        setUser(response.data)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) return <div>Loading...</div>
  return <div>Welcome, {user?.name}</div>
}
```

### All HTTP Methods

```tsx
'use client'

import { apiClient } from '@/lib/api-client'

// GET request
const users = await apiClient.get('/users')

// POST request
const newUser = await apiClient.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
})

// PUT request (full update)
const updated = await apiClient.put('/users/123', {
  name: 'Jane Doe',
  email: 'jane@example.com'
})

// PATCH request (partial update)
const patched = await apiClient.patch('/users/123', {
  name: 'Jane Smith'
})

// DELETE request
await apiClient.delete('/users/123')

// File upload
const formData = new FormData()
formData.append('file', file)
formData.append('title', 'My Document')
const uploaded = await apiClient.upload('/files', formData)
```

### Token Management

```tsx
import { tokenStorage } from '@/lib/api-client'

// Check if user is logged in
if (tokenStorage.hasTokens()) {
  console.log('User is authenticated')
}

// Get current access token
const token = tokenStorage.getAccessToken()

// Clear tokens (logout)
tokenStorage.clearTokens()
```

### Error Handling

```tsx
import { apiClient, ApiClientError } from '@/lib/api-client'

try {
  const response = await apiClient.get('/protected')
} catch (error) {
  if (error instanceof ApiClientError) {
    // Structured API error
    console.log('Status:', error.statusCode)
    console.log('Message:', error.message)

    // Check error type
    if (error.isUnauthorized()) {
      // Redirect to login
    } else if (error.isValidationError()) {
      // Show validation errors
    } else if (error.isServerError()) {
      // Show server error message
    }
  } else {
    // Network or other error
    console.error('Unexpected error:', error)
  }
}
```

### Skip Authentication

```tsx
// For public endpoints that don't require authentication
const publicData = await apiClient.get('/public/stats', {
  skipAuth: true
})
```

---

## 🔧 Server-Side Usage (`api-server.ts`)

### Server Components

```tsx
import { createServerClient } from '@/lib/api-server'

export default async function UsersPage() {
  const serverClient = createServerClient()

  try {
    const response = await serverClient.get('/users')

    return (
      <div>
        <h1>Users</h1>
        <ul>
          {response.data.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    )
  } catch (error) {
    return <div>Error loading users</div>
  }
}
```

### Protected Server Component

```tsx
import { serverApiClient, serverTokenStorage } from '@/lib/api-server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // Check authentication
  if (!(await serverTokenStorage.hasTokens())) {
    redirect('/login')
  }

  // Use server API client
  const response = await serverApiClient.get('/dashboard/stats')

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Sales: {response.data.totalSales}</p>
    </div>
  )
}
```

### API Routes (App Router)

```tsx
// app/api/users/route.ts
import { serverApiClient } from '@/lib/api-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const response = await serverApiClient.get('/users')
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    const response = await serverApiClient.post('/users', body)
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
```

### Server Actions

```tsx
'use server'

import { serverApiClient, serverTokenStorage } from '@/lib/api-server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  try {
    const response = await serverApiClient.patch('/users/profile', {
      name: formData.get('name'),
      email: formData.get('email')
    })

    revalidatePath('/profile')
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function logout() {
  await serverTokenStorage.clearTokens()
  revalidatePath('/', 'layout')
}
```

### Login/Signup Server Actions

```tsx
'use server'

import { serverApiClient, serverTokenStorage } from '@/lib/api-server'

export async function loginAction(email: string, password: string) {
  try {
    const response = await serverApiClient.post('/auth/login',
      { email, password },
      { skipAuth: true } // Login endpoint doesn't need auth
    )

    // Store tokens in secure HTTP-only cookies
    if (response.data.accessToken && response.data.refreshToken) {
      await serverTokenStorage.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      )
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Invalid credentials' }
  }
}

export async function signupAction(userData: {
  name: string
  email: string
  password: string
}) {
  try {
    const response = await serverApiClient.post('/auth/signup',
      userData,
      { skipAuth: true }
    )

    // Auto-login after signup
    if (response.data.accessToken && response.data.refreshToken) {
      await serverTokenStorage.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      )
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create account'
    }
  }
}
```

### Middleware with Custom Token

```tsx
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClientWithToken } from '@/lib/api-server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('lms_access_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token with backend
  try {
    const client = createClientWithToken(token)
    await client.get('/auth/verify')
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*']
}
```

---

## 🔐 Authentication Patterns

### Complete Login Flow

**Client Component (Login Form)**
```tsx
'use client'

import { useRouter } from 'next/navigation'
import { loginAction } from '@/actions/auth'

export default function LoginForm() {
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = await loginAction(
      formData.get('email') as string,
      formData.get('password') as string
    )

    if (result.success) {
      router.push('/dashboard')
      router.refresh() // Refresh server components
    } else {
      alert(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  )
}
```

**Server Action**
```tsx
'use server'

import { createServerClient, serverTokenStorage } from '@/lib/api-server'

export async function loginAction(email: string, password: string) {
  const serverClient = createServerClient()

  try {
    const response = await serverClient.post('/auth/login',
      { email, password },
      { skipAuth: true }
    )

    serverTokenStorage.setTokens(
      response.data.accessToken,
      response.data.refreshToken
    )

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Invalid credentials' }
  }
}
```

### Complete Logout Flow

**Client Component**
```tsx
'use client'

import { logoutAction } from '@/actions/auth'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await logoutAction()
    router.push('/login')
    router.refresh()
  }

  return <button onClick={handleLogout}>Logout</button>
}
```

**Server Action**
```tsx
'use server'

import { serverTokenStorage } from '@/lib/api-server'
import { revalidatePath } from 'next/cache'

export async function logoutAction() {
  serverTokenStorage.clearTokens()
  revalidatePath('/', 'layout')
}
```

---

## 🚀 Advanced Patterns

### Parallel Requests in Server Components

```tsx
import { serverApiClient } from '@/lib/api-server'

export default async function DashboardPage() {
  // Execute requests in parallel
  const [users, stats, activities] = await Promise.all([
    serverApiClient.get('/users'),
    serverApiClient.get('/stats'),
    serverApiClient.get('/activities')
  ])

  return (
    <div>
      <UsersList users={users.data} />
      <StatsPanel stats={stats.data} />
      <ActivityFeed activities={activities.data} />
    </div>
  )
}
```

### Optimistic Updates with Server Actions

```tsx
'use client'

import { useOptimistic } from 'react'
import { updateUserAction } from '@/actions/users'

export function UserProfile({ user }) {
  const [optimisticUser, setOptimisticUser] = useOptimistic(user)

  async function handleUpdate(formData: FormData) {
    // Update UI optimistically
    setOptimisticUser({
      ...user,
      name: formData.get('name')
    })

    // Perform actual update
    await updateUserAction(formData)
  }

  return (
    <form action={handleUpdate}>
      <input name="name" defaultValue={optimisticUser.name} />
      <button type="submit">Update</button>
    </form>
  )
}
```

### Custom Error Handling

```tsx
import { ApiClientError } from '@/lib/api-client'
import { serverApiClient } from '@/lib/api-server'

export default async function UsersPage() {
  try {
    const response = await serverApiClient.get('/users')
    return <UsersList users={response.data} />
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.isUnauthorized()) {
        return <div>Please login to view users</div>
      }
      if (error.isServerError()) {
        return <div>Server error. Please try again later.</div>
      }
    }
    return <div>Something went wrong</div>
  }
}
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Backend API URL (server-side only)
LMS_BACKEND_URL=https://api.production.com/api

# Backend API URL (exposed to browser)
NEXT_PUBLIC_LMS_BACKEND_URL=https://api.production.com/api

# Development (both default to http://localhost:5000/api)
```

### Cookie Security

Server cookies are configured with:
- ✅ `httpOnly: true` - Cannot be accessed via JavaScript (XSS protection)
- ✅ `secure: true` - HTTPS only in production
- ✅ `sameSite: 'lax'` - CSRF protection
- ✅ `path: '/'` - Site-wide access
- ✅ Access token: 15 minutes expiry
- ✅ Refresh token: 7 days expiry

---

## 🛠️ Troubleshooting

### "Authentication required" error on server

```tsx
// ❌ Wrong: Using client's apiClient on server
import { apiClient } from '@/lib/api-client' // Don't use on server

// ✅ Correct: Using server client
import { serverApiClient } from '@/lib/api-server'
```

### Tokens not persisting

**Client-side**: Check if localStorage is available (browser only)
**Server-side**: Verify cookies are being set with correct domain and path

### CORS errors

Client and server use different approaches:
- **Client**: Browser handles CORS automatically
- **Server**: Next.js server-to-server (no CORS issues)

If you see CORS errors, you're likely using client API in server context or vice versa.

---

## 📊 Type Safety

Both clients use the same TypeScript types:

```tsx
import type { ApiResponse, ApiError } from '@/types/api'

// Generic API response type
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// Error response type
interface ApiError {
  error: string
  message: string
  statusCode: number
  timestamp: string
}

// Usage with typed response
interface User {
  id: string
  name: string
  email: string
}

const response = await apiClient.get<User[]>('/users')
// response.data is typed as User[]
```

---

## 🎯 Best Practices

1. **Use Server Components by default** - Fetch data on server when possible
2. **Client Components for interactivity** - Use client API for user actions
3. **Server Actions for mutations** - Use server client for forms and updates
4. **Error boundaries** - Wrap components with error handling
5. **Loading states** - Show loading UI while fetching
6. **Revalidation** - Use `revalidatePath` after mutations
7. **Type safety** - Always provide generic types for responses
8. **Security** - Never expose sensitive tokens to client
9. **Cache control** - Server requests default to `no-store` (can customize)
10. **Environment variables** - Use `NEXT_PUBLIC_` prefix only when needed in browser

---

## 📚 Complete Example: CRUD Operations

```tsx
// app/users/page.tsx (Server Component)
import { serverApiClient } from '@/lib/api-server'
import { CreateUserForm } from './CreateUserForm'
import { UserCard } from './UserCard'

export default async function UsersPage() {
  const response = await serverApiClient.get('/users')

  return (
    <div>
      <h1>Users</h1>
      <CreateUserForm />
      <div>
        {response.data.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}

// app/users/CreateUserForm.tsx (Client Component)
'use client'

import { createUserAction } from './actions'
import { useRouter } from 'next/navigation'

export function CreateUserForm() {
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const result = await createUserAction(formData)
    if (result.success) {
      router.refresh() // Refresh server component
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">Create User</button>
    </form>
  )
}

// app/users/actions.ts (Server Action)
'use server'

import { serverApiClient } from '@/lib/api-server'
import { revalidatePath } from 'next/cache'

export async function createUserAction(formData: FormData) {
  try {
    await serverApiClient.post('/users', {
      name: formData.get('name'),
      email: formData.get('email')
    })

    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteUserAction(userId: string) {
  try {
    await serverApiClient.delete(`/users/${userId}`)
    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review error messages carefully
3. Verify you're using the correct client (server vs client)
4. Check environment variables configuration
5. Inspect network requests in browser DevTools
