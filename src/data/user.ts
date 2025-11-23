import type { UserType } from "@/types"

/**
 * @deprecated This mock user data is no longer used for authentication.
 * Authentication now uses real database users via Prisma.
 * This data is kept temporarily for UI components that haven't been
 * migrated to use NextAuth session data yet.
 *
 * TODO: Update all components importing this to use session data instead:
 * - user-dropdown.tsx
 * - sign-in-form.tsx
 * - profile pages
 * - settings pages
 */
export const userData: UserType = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  name: "John Doe",
  password: "StrongPass123",
  username: "john.doe",
  role: "Next.js Developer",
  avatar: "/images/avatars/male-01.svg",
  background: "",
  status: "ONLINE",
  phoneNumber: "+15558675309",
  email: "john.doe@example.com",
  state: "California",
  country: "United States",
  address: "123 Main Street, Apt 4B",
  zipCode: "90210",
  language: "English",
  timeZone: "GMT+08:00",
  currency: "USD",
  organization: "Tech Innovations Inc.",
  twoFactorAuth: false,
  loginAlerts: true,
  accountReoveryOption: "email",
  connections: 1212,
  followers: 3300,
}
