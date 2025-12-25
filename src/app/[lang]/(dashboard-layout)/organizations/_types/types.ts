import type { BaseEntity, MembershipStatus, User } from "@/types/api"

// ============================================
// Organization Types
// ============================================

export interface OrganizationSettings {
  allowMultipleLevels?: boolean
  requireTermAssignment?: boolean
  allowStudentSelfEnroll?: boolean
}

export interface Organization extends BaseEntity {
  name: string
  description?: string
  orgcover?: string
  creatorId: string | User
  settings?: OrganizationSettings
  levels?: string[]
  terms?: string[]
}

export interface OrganizationRole extends BaseEntity {
  organizationId: string
  name: string
  permissions: string[]
  description?: string
}

export interface OrganizationMembership extends BaseEntity {
  organizationId: string | Organization
  userId: string | User
  roleId: string | OrganizationRole
  joinedDate: string
  joinedAt?: string
  status: MembershipStatus
}

export interface CreateOrganizationRequest {
  name: string
  description?: string
  orgcover?: string
  settings?: OrganizationSettings
}
