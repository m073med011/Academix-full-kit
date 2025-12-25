import { CreateOrganizationRequest } from "../_types/types"
import { OrganizationMembership } from "@/types/api"

import { apiClient } from "@/lib/api-client"

export const organizationService = {
  getUserOrganizations: async () => {
    return apiClient.get<OrganizationMembership[]>("/users/organizations")
  },

  createOrganization: async (data: CreateOrganizationRequest) => {
    return apiClient.post("/organizations", data)
  },
}
